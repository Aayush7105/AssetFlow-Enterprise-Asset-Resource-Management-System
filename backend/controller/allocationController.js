const db = require("../config/db");
const { createActivityLog } = require("../utils/activityLogService");
const allocateAsset = async (req, res) => {
    try {

        const {
            asset_id,
            user_id,
            expected_return_date,
            notes
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

        const asset = assetResult.rows[0];

        if (asset.status !== "AVAILABLE") {
            return res.status(400).json({
                success: false,
                message: "Asset is not available for allocation."
            });
        }

        
        const userResult = await db.query(
            `
            SELECT id, status
            FROM users
            WHERE id = $1
            `,
            [user_id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Employee not found."
            });
        }

        if (userResult.rows[0].status !== "ACTIVE") {
            return res.status(400).json({
                success: false,
                message: "Employee account is inactive."
            });
        }

      
        const allocationCheck = await db.query(
            `
            SELECT id
            FROM allocations
            WHERE asset_id = $1
            AND status = 'ACTIVE'
            `,
            [asset_id]
        );

        if (allocationCheck.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Asset is already allocated."
            });
        }

        
        await db.query("BEGIN");

        const allocationResult = await db.query(
            `
            INSERT INTO allocations
            (
                asset_id,
                user_id,
                allocated_by,
                expected_return_date,
                notes
            )
            VALUES
            (
                $1,$2,$3,$4,$5
            )
            RETURNING *
            `,
            [
                asset_id,
                user_id,
                req.user.id,
                expected_return_date || null,
                notes || null
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
            [asset_id]
        );

        await db.query("COMMIT");
        await createActivityLog({

    user_id:req.user.id,

    action:"ASSET_ALLOCATED",

    entity_type:"ASSET",

    entity_id:asset_id,

    description:"Allocated asset to employee."

});

        return res.status(201).json({
            success: true,
            message: "Asset allocated successfully.",
            data: allocationResult.rows[0]
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


const getAllAllocations = async (req, res) => {
    try {

        const result = await db.query(
            `
            SELECT

                a.*,

                ass.asset_tag,
                ass.name AS asset_name,
                ass.serial_number,

                emp.name AS employee_name,
                emp.email AS employee_email,

                alloc.name AS allocated_by_name

            FROM allocations a

            INNER JOIN assets ass
            ON a.asset_id = ass.id

            INNER JOIN users emp
            ON a.user_id = emp.id

            INNER JOIN users alloc
            ON a.allocated_by = alloc.id

            ORDER BY a.created_at DESC
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


const getAllocationById = async (req, res) => {
    try {

        const { id } = req.params;

        const result = await db.query(
            `
            SELECT

                a.*,

                ass.asset_tag,
                ass.name AS asset_name,
                ass.serial_number,
                ass.location,

                emp.name AS employee_name,
                emp.email AS employee_email,
                emp.phone,

                alloc.name AS allocated_by_name

            FROM allocations a

            INNER JOIN assets ass
            ON a.asset_id = ass.id

            INNER JOIN users emp
            ON a.user_id = emp.id

            INNER JOIN users alloc
            ON a.allocated_by = alloc.id

            WHERE a.id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Allocation not found."
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

const returnAsset = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            condition_notes
        } = req.body;

        const allocationResult = await db.query(
            `
            SELECT *
            FROM allocations
            WHERE id = $1
            `,
            [id]
        );

        if (allocationResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Allocation not found."
            });
        }

        const allocation = allocationResult.rows[0];

        if (allocation.status === "RETURNED") {
            return res.status(400).json({
                success: false,
                message: "Asset has already been returned."
            });
        }

        await db.query("BEGIN");

      
        await db.query(
            `
            UPDATE allocations
            SET

                actual_return_date = CURRENT_TIMESTAMP,

                return_condition_notes = $1,

                status = 'RETURNED',

                updated_at = CURRENT_TIMESTAMP

            WHERE id = $2
            `,
            [
                condition_notes || null,
                id
            ]
        );

    
        await db.query(
            `
            UPDATE assets
            SET

                status = 'AVAILABLE',

                updated_at = CURRENT_TIMESTAMP

            WHERE id = $1
            `,
            [
                allocation.asset_id
            ]
        );

        await db.query("COMMIT");

        return res.status(200).json({
            success: true,
            message: "Asset returned successfully."
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

const getAssetAllocationHistory = async (req, res) => {
    try {

        const { assetId } = req.params;

        const assetResult = await db.query(
            `
            SELECT
                id,
                asset_tag,
                name
            FROM assets
            WHERE id = $1
            `,
            [assetId]
        );

        if (assetResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Asset not found."
            });
        }

        const result = await db.query(
            `
            SELECT

                a.id,

                a.expected_return_date,

                a.actual_return_date,

                a.status,

                a.notes,

                a.return_condition_notes,

                a.created_at,

                emp.name AS employee_name,
                emp.email AS employee_email,

                alloc.name AS allocated_by_name

            FROM allocations a

            INNER JOIN users emp
            ON a.user_id = emp.id

            INNER JOIN users alloc
            ON a.allocated_by = alloc.id

            WHERE a.asset_id = $1

            ORDER BY a.created_at DESC
            `,
            [assetId]
        );

        return res.status(200).json({
            success: true,
            asset: assetResult.rows[0],
            history: result.rows
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
    allocateAsset,
    getAllAllocations,
    getAllocationById,
    returnAsset,
    getAssetAllocationHistory
};