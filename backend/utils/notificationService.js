const db = require("../config/db");

const createNotification = async ({
    user_id,
    title,
    message,
    type,
    reference_type = null,
    reference_id = null
}) => {

    await db.query(
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

};

module.exports = {
    createNotification
};