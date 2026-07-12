const db = require("../config/db");

const createNotification = async ({
    user_id,
    title,
    message,
    type = "GENERAL",
    reference_type = null,
    reference_id = null
}) => {
    const result = await db.query(
        `
        INSERT INTO notifications
        (
            user_id,
            title,
            message,
            type,
            reference_type,
            reference_id
        )
        VALUES
        ($1,$2,$3,$4,$5,$6)
        RETURNING *
        `,
        [
            user_id,
            title,
            message,
            type,
            reference_type,
            reference_id
        ]
    );

    return result.rows[0];
};

const notifyUser = async (payload) => {
    if (!payload.user_id) return null;

    try {
        return await createNotification(payload);
    } catch (err) {
        console.error("Failed to create notification", err);
        return null;
    }
};

const notifyUsersByRole = async ({
    roles,
    exclude_user_id = null,
    ...payload
}) => {
    if (!Array.isArray(roles) || roles.length === 0) return [];

    try {
        const users = await db.query(
            `
            SELECT DISTINCT u.id
            FROM users u
            INNER JOIN user_roles ur
                ON ur.user_id = u.id
            WHERE ur.role = ANY($1)
            AND u.status = 'ACTIVE'
            AND ($2::uuid IS NULL OR u.id <> $2::uuid)
            `,
            [roles, exclude_user_id]
        );

        return Promise.all(
            users.rows.map((user) => notifyUser({
                ...payload,
                user_id: user.id
            }))
        );
    } catch (err) {
        console.error("Failed to notify users by role", err);
        return [];
    }
};

module.exports = {
    createNotification,
    notifyUser,
    notifyUsersByRole
};
