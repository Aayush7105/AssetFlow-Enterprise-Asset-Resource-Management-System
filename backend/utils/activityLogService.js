const db = require("../config/db");

const createActivityLog = async ({
    user_id,
    action,
    entity_type,
    entity_id,
    description
}) => {

    try {

        await db.query(
            `
            INSERT INTO activity_logs
            (
                user_id,
                action,
                entity_type,
                entity_id,
                description
            )
            VALUES
            ($1,$2,$3,$4,$5)
            `,
            [
                user_id,
                action,
                entity_type,
                entity_id,
                description
            ]
        );

    } catch (err) {

        console.error("Activity Log Error:", err);

    }

};

module.exports = {
    createActivityLog
};