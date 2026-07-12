const db = require("../config/db");
const getMyNotifications = async (req, res) => {
    try {

        const result = await db.query(
            `
            SELECT

                id,

                title,

                message,

                type,

                is_read,

                reference_type,

                reference_id,

                created_at

            FROM notifications

            WHERE user_id = $1

            ORDER BY created_at DESC
            `,
            [
                req.user.id
            ]
        );

       
        const unread = await db.query(
            `
            SELECT COUNT(*) AS unread_count

            FROM notifications

            WHERE user_id = $1

            AND is_read = FALSE
            `,
            [
                req.user.id
            ]
        );

        return res.status(200).json({

            success: true,

            unread: Number(unread.rows[0].unread_count),

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

const getNotificationById = async (req, res) => {
    try {

        const { id } = req.params;

        const result = await db.query(
            `
            SELECT *

            FROM notifications

            WHERE id = $1

            AND user_id = $2
            `,
            [
                id,
                req.user.id
            ]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Notification not found."

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
const markAsRead = async (req, res) => {
    try {

        const { id } = req.params;

        const notification = await db.query(
            `
            SELECT *
            FROM notifications
            WHERE id = $1
            AND user_id = $2
            `,
            [
                id,
                req.user.id
            ]
        );

        if (notification.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Notification not found."
            });
        }

        if (notification.rows[0].is_read) {
            return res.status(200).json({
                success: true,
                message: "Notification already marked as read."
            });
        }

        const result = await db.query(
            `
            UPDATE notifications
            SET

                is_read = TRUE,

                updated_at = CURRENT_TIMESTAMP

            WHERE id = $1

            RETURNING *
            `,
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Notification marked as read.",
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

const markAllAsRead = async (req, res) => {
    try {

        await db.query(
            `
            UPDATE notifications

            SET

                is_read = TRUE,

                updated_at = CURRENT_TIMESTAMP

            WHERE user_id = $1

            AND is_read = FALSE
            `,
            [
                req.user.id
            ]
        );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read."
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};
const deleteNotification = async (req, res) => {
    try {

        const { id } = req.params;

        const notification = await db.query(
            `
            SELECT *
            FROM notifications
            WHERE id = $1
            AND user_id = $2
            `,
            [
                id,
                req.user.id
            ]
        );

        if (notification.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Notification not found."
            });
        }

        await db.query(
            `
            DELETE FROM notifications
            WHERE id = $1
            `,
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Notification deleted successfully."
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
    getMyNotifications,
    getNotificationById
};