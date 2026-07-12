const db = require("../config/db");

const generateAssetTag = async () => {

    const result = await db.query(`
        SELECT COUNT(*) total
        FROM assets
    `);

    const nextNumber =
        Number(result.rows[0].total)+1;

    return `AF-${String(nextNumber).padStart(4,"0")}`;

};

module.exports = generateAssetTag;