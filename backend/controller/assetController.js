const db = require("../config/db");
const generateAssetTag = require("../utils/generateAssetTag");

const getCurrentUserRole = async (userId) => {
    const result = await db.query(
        `
        SELECT role
        FROM user_roles
        WHERE user_id = $1
        ORDER BY assigned_at DESC
        LIMIT 1
        `,
        [userId]
    );

    return result.rows[0]?.role || null;
};

const canViewAllAssets = async (userId) => {
    const role = await getCurrentUserRole(userId);
    return ["ADMIN", "ASSET_MANAGER"].includes(role);
};

const assetListSelect = `
    SELECT
        a.*,
        ac.name AS category_name,
        d.name AS department_name,
        assigned.name AS assigned_employee
    FROM assets a
    LEFT JOIN asset_categories ac
    ON a.category_id = ac.id
    LEFT JOIN departments d
    ON a.department_id = d.id
    LEFT JOIN allocations active_allocation
    ON active_allocation.asset_id = a.id
    AND active_allocation.status = 'ACTIVE'
    LEFT JOIN users assigned
    ON assigned.id = active_allocation.user_id
`;

const createAsset = async (req, res) => {
    try {
        const {
            name,
            category_id,
            department_id,
            serial_number,
            acquisition_date,
            acquisition_cost,
            asset_condition,
            location,
            is_bookable
        } = req.body;

        const serialCheck = await db.query(
            `
            SELECT id
            FROM assets
            WHERE serial_number = $1
            `,
            [serial_number]
        );

        if (serialCheck.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Serial Number already exists."
            });
        }

        const assetTag = await generateAssetTag();

        const result = await db.query(
            `
            INSERT INTO assets
            (
                asset_tag,
                name,
                category_id,
                department_id,
                serial_number,
                acquisition_date,
                acquisition_cost,
                asset_condition,
                location,
                is_bookable
            )
            VALUES
            (
                $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
            )
            RETURNING *
            `,
            [
                assetTag,
                name,
                category_id,
                department_id,
                serial_number,
                acquisition_date,
                acquisition_cost,
                asset_condition,
                location,
                is_bookable
            ]
        );

        res.status(201).json({
            success: true,
            message: "Asset Registered Successfully.",
            data: result.rows[0]
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const getAllAssets = async (req, res) => {
    try {
        const viewAll = await canViewAllAssets(req.user.id);

        const result = await db.query(
            `
            ${assetListSelect}
            ${viewAll ? "" : "WHERE active_allocation.user_id = $1"}
            ORDER BY a.created_at DESC
            `,
            viewAll ? [] : [req.user.id]
        );

        res.status(200).json({
            success: true,
            data: result.rows
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const getAssetById = async (req, res) => {
    try {
        const { id } = req.params;
        const viewAll = await canViewAllAssets(req.user.id);

        const result = await db.query(
            `
            ${assetListSelect}
            WHERE a.id = $1
            ${viewAll ? "" : "AND active_allocation.user_id = $2"}
            `,
            viewAll ? [id] : [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Asset not found."
            });
        }

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const updateAsset = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            category_id,
            department_id,
            serial_number,
            acquisition_date,
            acquisition_cost,
            asset_condition,
            location,
            is_bookable,
            status
        } = req.body;

        const result = await db.query(
            `
            UPDATE assets
            SET
                name=$1,
                category_id=$2,
                department_id=$3,
                serial_number=$4,
                acquisition_date=$5,
                acquisition_cost=$6,
                asset_condition=$7,
                location=$8,
                is_bookable=$9,
                status=$10,
                updated_at=CURRENT_TIMESTAMP
            WHERE id=$11
            RETURNING *
            `,
            [
                name,
                category_id,
                department_id,
                serial_number,
                acquisition_date,
                acquisition_cost,
                asset_condition,
                location,
                is_bookable,
                status,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Asset not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Asset Updated Successfully.",
            data: result.rows[0]
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const deleteAsset = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            `
            UPDATE assets
            SET
                status='DISPOSED',
                updated_at=CURRENT_TIMESTAMP
            WHERE id=$1
            RETURNING *
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Asset not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Asset disposed successfully."
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const searchAssets = async (req, res) => {
    try {
        const { query } = req.query;
        const viewAll = await canViewAllAssets(req.user.id);
        const params = viewAll ? [query] : [query, req.user.id];

        const result = await db.query(
            `
            ${assetListSelect}
            WHERE
            (
                LOWER(a.asset_tag)=LOWER($1)
                OR LOWER(a.serial_number)=LOWER($1)
                OR LOWER(a.name) LIKE LOWER('%'||$1||'%')
            )
            ${viewAll ? "" : "AND active_allocation.user_id = $2"}
            ORDER BY a.created_at DESC
            `,
            params
        );

        res.status(200).json({
            success: true,
            data: result.rows
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    createAsset,
    getAllAssets,
    getAssetById,
    updateAsset,
    deleteAsset,
    searchAssets
};
