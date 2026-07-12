const db = require("../config/db");

const createBooking = async (req, res) => {
    try {

        const {
            asset_id,
            title,
            purpose,
            start_time,
            end_time
        } = req.body;

        if (new Date(start_time) >= new Date(end_time)) {
            return res.status(400).json({
                success: false,
                message: "End time must be after start time."
            });
        }

       
        const assetResult = await db.query(
            `
            SELECT *
            FROM assets
            WHERE id = $1
            `,
            [asset_id]
        );

        if (assetResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Asset not found."
            });
        }

        const asset = assetResult.rows[0];

        if (!asset.is_bookable) {
            return res.status(400).json({
                success: false,
                message: "This asset cannot be booked."
            });
        }

        
        const overlap = await db.query(
            `
            SELECT id
            FROM resource_bookings
            WHERE asset_id = $1
            AND status IN ('UPCOMING','ONGOING')
            AND (
                start_time < $3
                AND end_time > $2
            )
            `,
            [
                asset_id,
                start_time,
                end_time
            ]
        );

        if (overlap.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Resource is already booked for the selected time."
            });
        }

        await db.query("BEGIN");

        const booking = await db.query(
            `
            INSERT INTO resource_bookings
            (
                asset_id,
                user_id,
                title,
                purpose,
                start_time,
                end_time
            )
            VALUES
            (
                $1,$2,$3,$4,$5,$6
            )
            RETURNING *
            `,
            [
                asset_id,
                req.user.id,
                title,
                purpose,
                start_time,
                end_time
            ]
        );

        await db.query("COMMIT");

        return res.status(201).json({
            success: true,
            message: "Booking created successfully.",
            data: booking.rows[0]
        });

    } catch (err) {

        await db.query("ROLLBACK");

        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};


const getAllBookings = async (req, res) => {
    try {

        const result = await db.query(
            `
            SELECT

                rb.*,

                a.asset_tag,
                a.name AS asset_name,
                a.location,

                u.name AS booked_by,
                u.email

            FROM resource_bookings rb

            INNER JOIN assets a
                ON rb.asset_id = a.id

            INNER JOIN users u
                ON rb.user_id = u.id

            ORDER BY rb.start_time DESC
            `
        );

        return res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

const getBookingById = async (req, res) => {
    try {

        const { id } = req.params;

        const result = await db.query(
            `
            SELECT

                rb.*,

                a.asset_tag,
                a.name AS asset_name,
                a.location,

                u.name AS booked_by,
                u.email,
                u.phone

            FROM resource_bookings rb

            INNER JOIN assets a
                ON rb.asset_id = a.id

            INNER JOIN users u
                ON rb.user_id = u.id

            WHERE rb.id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        return res.status(200).json({
            success: true,
            data: result.rows[0]
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};


const updateBooking = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            title,
            purpose,
            start_time,
            end_time
        } = req.body;

        if (new Date(start_time) >= new Date(end_time)) {
            return res.status(400).json({
                success: false,
                message: "End time must be after start time."
            });
        }

        const bookingResult = await db.query(
            `
            SELECT *
            FROM resource_bookings
            WHERE id = $1
            `,
            [id]
        );

        if (bookingResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        const booking = bookingResult.rows[0];

        if (
            booking.status === "COMPLETED" ||
            booking.status === "CANCELLED"
        ) {
            return res.status(400).json({
                success: false,
                message: "Booking cannot be updated."
            });
        }

        const overlap = await db.query(
            `
            SELECT id
            FROM resource_bookings
            WHERE asset_id = $1
            AND id <> $2
            AND status IN ('UPCOMING','ONGOING')
            AND (
                start_time < $4
                AND end_time > $3
            )
            `,
            [
                booking.asset_id,
                id,
                start_time,
                end_time
            ]
        );

        if (overlap.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Selected time slot is already booked."
            });
        }

        await db.query("BEGIN");

        const result = await db.query(
            `
            UPDATE resource_bookings
            SET

                title = $1,

                purpose = $2,

                start_time = $3,

                end_time = $4,

                updated_at = CURRENT_TIMESTAMP

            WHERE id = $5

            RETURNING *
            `,
            [
                title,
                purpose,
                start_time,
                end_time,
                id
            ]
        );

        await db.query("COMMIT");

        return res.status(200).json({
            success: true,
            message: "Booking updated successfully.",
            data: result.rows[0]
        });

    } catch (err) {

        await db.query("ROLLBACK");

        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

const cancelBooking = async (req, res) => {
    try {

        const { id } = req.params;

        const bookingResult = await db.query(
            `
            SELECT *
            FROM resource_bookings
            WHERE id = $1
            `,
            [id]
        );

        if (bookingResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        const booking = bookingResult.rows[0];

        if (
            booking.status === "CANCELLED" ||
            booking.status === "COMPLETED"
        ) {
            return res.status(400).json({
                success: false,
                message: "Booking cannot be cancelled."
            });
        }

        await db.query(
            `
            UPDATE resource_bookings
            SET

                status = 'CANCELLED',

                updated_at = CURRENT_TIMESTAMP

            WHERE id = $1

            RETURNING *
            `,
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Booking cancelled successfully."
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};
const completeBooking = async (req, res) => {
    try {

        const { id } = req.params;

        const bookingResult = await db.query(
            `
            SELECT *
            FROM resource_bookings
            WHERE id = $1
            `,
            [id]
        );

        if (bookingResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        const booking = bookingResult.rows[0];

        if (booking.status === "COMPLETED") {
            return res.status(400).json({
                success: false,
                message: "Booking is already completed."
            });
        }

        if (booking.status === "CANCELLED") {
            return res.status(400).json({
                success: false,
                message: "Cancelled booking cannot be completed."
            });
        }

        const result = await db.query(
            `
            UPDATE resource_bookings
            SET

                status = 'COMPLETED',

                updated_at = CURRENT_TIMESTAMP

            WHERE id = $1

            RETURNING *
            `,
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Booking completed successfully.",
            data: result.rows[0]
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

module.exports = {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBooking,
    cancelBooking,
    completeBooking
};