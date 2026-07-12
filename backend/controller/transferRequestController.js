const db = require("../config/db");

const createTransferRequest = async (req, res) => {
    try {

        const {
            asset_id,
            to_user_id,
            reason
        } = req.body;

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

      
        if (assetResult.rows[0].status !== "ALLOCATED") {
            return res.status(400).json({
                success: false,
                message: "Asset is not currently allocated."
            });
        }

        const allocationResult = await db.query(
            `
            SELECT *
            FROM allocations
            WHERE asset_id = $1
            AND status = 'ACTIVE'
            `,
            [asset_id]
        );

        if (allocationResult.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No active allocation found."
            });
        }

        const allocation = allocationResult.rows[0];

       
        const userResult = await db.query(
            `
            SELECT id,status
            FROM users
            WHERE id = $1
            `,
            [to_user_id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Target employee not found."
            });
        }

        if (userResult.rows[0].status !== "ACTIVE") {
            return res.status(400).json({
                success: false,
                message: "Target employee is inactive."
            });
        }

        if (allocation.user_id === to_user_id) {
            return res.status(400).json({
                success: false,
                message: "Asset is already allocated to this employee."
            });
        }
        const pending = await db.query(
            `
            SELECT id
            FROM transfer_requests
            WHERE asset_id = $1
            AND status = 'PENDING'
            `,
            [asset_id]
        );

        if (pending.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "A transfer request is already pending."
            });
        }

        const result = await db.query(
            `
            INSERT INTO transfer_requests
            (
                asset_id,
                from_user_id,
                to_user_id,
                requested_by,
                reason
            )
            VALUES
            (
                $1,$2,$3,$4,$5
            )
            RETURNING *
            `,
            [
                asset_id,
                allocation.user_id,
                to_user_id,
                req.user.id,
                reason
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Transfer request created successfully.",
            data: result.rows[0]
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};
// Get All Transfer Requests
const getAllTransferRequests = async (req, res) => {
    try {

        const result = await db.query(
            `
            SELECT

                tr.*,

                a.asset_tag,
                a.name AS asset_name,

                fu.name AS from_user_name,
                tu.name AS to_user_name,

                ru.name AS requested_by_name,
                ap.name AS approved_by_name

            FROM transfer_requests tr

            INNER JOIN assets a
                ON tr.asset_id = a.id

            INNER JOIN users fu
                ON tr.from_user_id = fu.id

            INNER JOIN users tu
                ON tr.to_user_id = tu.id

            INNER JOIN users ru
                ON tr.requested_by = ru.id

            LEFT JOIN users ap
                ON tr.approved_by = ap.id

            ORDER BY tr.requested_at DESC
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


const getTransferRequestById = async (req, res) => {
    try {

        const { id } = req.params;

        const result = await db.query(
            `
            SELECT

                tr.*,

                a.asset_tag,
                a.name AS asset_name,
                a.serial_number,

                fu.name AS from_user_name,
                fu.email AS from_user_email,

                tu.name AS to_user_name,
                tu.email AS to_user_email,

                ru.name AS requested_by_name,

                ap.name AS approved_by_name

            FROM transfer_requests tr

            INNER JOIN assets a
                ON tr.asset_id = a.id

            INNER JOIN users fu
                ON tr.from_user_id = fu.id

            INNER JOIN users tu
                ON tr.to_user_id = tu.id

            INNER JOIN users ru
                ON tr.requested_by = ru.id

            LEFT JOIN users ap
                ON tr.approved_by = ap.id

            WHERE tr.id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Transfer request not found."
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
const approveTransferRequest = async (req, res) => {
    try {

        const { id } = req.params;

       
        const transferResult = await db.query(
            `
            SELECT *
            FROM transfer_requests
            WHERE id = $1
            `,
            [id]
        );

        if (transferResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Transfer request not found."
            });
        }

        const transfer = transferResult.rows[0];

        if (transfer.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message: "Transfer request has already been processed."
            });
        }

        await db.query("BEGIN");

       
        await db.query(
            `
            UPDATE allocations
            SET

                status = 'RETURNED',

                actual_return_date = CURRENT_TIMESTAMP,

                updated_at = CURRENT_TIMESTAMP

            WHERE asset_id = $1
            AND user_id = $2
            AND status = 'ACTIVE'
            `,
            [
                transfer.asset_id,
                transfer.from_user_id
            ]
        );

       
        await db.query(
            `
            INSERT INTO allocations
            (
                asset_id,
                user_id,
                allocated_by,
                expected_return_date,
                status
            )
            VALUES
            (
                $1,$2,$3,NULL,'ACTIVE'
            )
            `,
            [
                transfer.asset_id,
                transfer.to_user_id,
                req.user.id
            ]
        );

        await db.query(
            `
            UPDATE transfer_requests
            SET

                status = 'COMPLETED',

                approved_by = $1,

                approved_at = CURRENT_TIMESTAMP,

                completed_at = CURRENT_TIMESTAMP,

                updated_at = CURRENT_TIMESTAMP

            WHERE id = $2
            `,
            [
                req.user.id,
                id
            ]
        );

        await db.query(
            `
            UPDATE assets
            SET

                status = 'ALLOCATED',

                updated_at = CURRENT_TIMESTAMP

            WHERE id = $1
            `,
            [
                transfer.asset_id
            ]
        );

        await db.query("COMMIT");

        return res.status(200).json({
            success: true,
            message: "Transfer approved successfully."
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
const rejectTransferRequest = async (req, res) => {
    try {

        const { id } = req.params;

        const transferResult = await db.query(
            `
            SELECT *
            FROM transfer_requests
            WHERE id = $1
            `,
            [id]
        );

        if (transferResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Transfer request not found."
            });
        }

        const transfer = transferResult.rows[0];

        if (transfer.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message: "Transfer request has already been processed."
            });
        }

        await db.query(
            `
            UPDATE transfer_requests
            SET
                status = 'REJECTED',
                approved_by = $1,
                approved_at = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *
            `,
            [
                req.user.id,
                id
            ]
        );

        return res.status(200).json({
            success: true,
            message: "Transfer request rejected successfully."
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};