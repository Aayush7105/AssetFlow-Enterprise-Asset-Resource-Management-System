const db = require("../config/db");

const { createActivityLog } = require("../utils/activityLogService");
const raiseMaintenanceRequest = async (req, res) => {
    try {

        const {
            asset_id,
            issue,
            priority
        } = req.body;
        if (!asset_id || !issue || !priority) {
            return res.status(400).json({
                success: false,
                message: "Asset, issue and priority are required."
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

       
        if (asset.status === "UNDER_MAINTENANCE") {
            return res.status(400).json({
                success: false,
                message: "Asset is already under maintenance."
            });
        }

        const requestCheck = await db.query(
            `
            SELECT id
            FROM maintenance_requests
            WHERE asset_id = $1
            AND status IN
            (
                'PENDING',
                'APPROVED',
                'TECHNICIAN_ASSIGNED',
                'IN_PROGRESS'
            )
            `,
            [asset_id]
        );

        if (requestCheck.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "An active maintenance request already exists."
            });
        }

        const result = await db.query(
            `
            INSERT INTO maintenance_requests
            (
                asset_id,
                reported_by,
                issue,
                priority
            )
            VALUES
            (
                $1,$2,$3,$4
            )
            RETURNING *
            `,
            [
                asset_id,
                req.user.id,
                issue,
                priority
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Maintenance request raised successfully.",
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
const getAllMaintenanceRequests = async (req, res) => {
    try {

        const result = await db.query(
            `
            SELECT

                mr.*,

                a.asset_tag,
                a.name AS asset_name,

                reporter.name AS reported_by_name,

                approver.name AS approved_by_name,

                technician.name AS technician_name

            FROM maintenance_requests mr

            INNER JOIN assets a
                ON mr.asset_id = a.id

            INNER JOIN users reporter
                ON mr.reported_by = reporter.id

            LEFT JOIN users approver
                ON mr.approved_by = approver.id

            LEFT JOIN users technician
                ON mr.technician_id = technician.id

            ORDER BY mr.created_at DESC
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

const getMaintenanceRequestById = async (req, res) => {
    try {

        const { id } = req.params;

        const result = await db.query(
            `
            SELECT

                mr.*,

                a.asset_tag,
                a.name AS asset_name,
                a.serial_number,

                reporter.name AS reported_by_name,
                reporter.email AS reported_by_email,

                approver.name AS approved_by_name,

                technician.name AS technician_name

            FROM maintenance_requests mr

            INNER JOIN assets a
                ON mr.asset_id = a.id

            INNER JOIN users reporter
                ON mr.reported_by = reporter.id

            LEFT JOIN users approver
                ON mr.approved_by = approver.id

            LEFT JOIN users technician
                ON mr.technician_id = technician.id

            WHERE mr.id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Maintenance request not found."
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


const approveMaintenanceRequest = async (req, res) => {
    try {

        const { id } = req.params;

        const requestResult = await db.query(
            `
            SELECT *
            FROM maintenance_requests
            WHERE id = $1
            `,
            [id]
        );

        if (requestResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Maintenance request not found."
            });
        }

        const request = requestResult.rows[0];

        if (request.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message: "Only pending requests can be approved."
            });
        }

        await db.query("BEGIN");

       
        await db.query(
            `
            UPDATE maintenance_requests
            SET

                status = 'APPROVED',

                approved_by = $1,

                approved_at = CURRENT_TIMESTAMP,

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

                status = 'UNDER_MAINTENANCE',

                updated_at = CURRENT_TIMESTAMP

            WHERE id = $1
            `,
            [
                request.asset_id
            ]
        );

        await db.query("COMMIT");
        await createActivityLog({

    user_id:req.user.id,

    action:"MAINTENANCE_APPROVED",

    entity_type:"MAINTENANCE",

    entity_id:id,

    description:"Maintenance approved."

});

        return res.status(200).json({
            success: true,
            message: "Maintenance request approved successfully."
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
const rejectMaintenanceRequest = async (req, res) => {
    try {

        const { id } = req.params;

        const requestResult = await db.query(
            `
            SELECT *
            FROM maintenance_requests
            WHERE id = $1
            `,
            [id]
        );

        if (requestResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Maintenance request not found."
            });
        }

        const request = requestResult.rows[0];

        if (request.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message: "Only pending requests can be rejected."
            });
        }

        const result = await db.query(
            `
            UPDATE maintenance_requests
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
            message: "Maintenance request rejected successfully.",
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
const assignTechnician = async (req, res) => {
    try {

        const { id } = req.params;

        const { technician_id } = req.body;

       
        const requestResult = await db.query(
            `
            SELECT *
            FROM maintenance_requests
            WHERE id = $1
            `,
            [id]
        );

        if (requestResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Maintenance request not found."
            });
        }

        const request = requestResult.rows[0];

        if (request.status !== "APPROVED") {
            return res.status(400).json({
                success: false,
                message: "Maintenance request must be approved first."
            });
        }

      
        const technicianResult = await db.query(
            `
            SELECT id,status
            FROM users
            WHERE id = $1
            `,
            [technician_id]
        );

        if (technicianResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Technician not found."
            });
        }

        if (technicianResult.rows[0].status !== "ACTIVE") {
            return res.status(400).json({
                success: false,
                message: "Technician account is inactive."
            });
        }

        const result = await db.query(
            `
            UPDATE maintenance_requests
            SET

                technician_id = $1,

                status = 'TECHNICIAN_ASSIGNED',

                updated_at = CURRENT_TIMESTAMP

            WHERE id = $2

            RETURNING *
            `,
            [
                technician_id,
                id
            ]
        );

        return res.status(200).json({
            success: true,
            message: "Technician assigned successfully.",
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
// Start Maintenance
const startMaintenance = async (req, res) => {
    try {

        const { id } = req.params;

        const requestResult = await db.query(
            `
            SELECT *
            FROM maintenance_requests
            WHERE id = $1
            `,
            [id]
        );

        if (requestResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Maintenance request not found."
            });
        }

        const request = requestResult.rows[0];

        if (request.status !== "TECHNICIAN_ASSIGNED") {
            return res.status(400).json({
                success: false,
                message: "Technician must be assigned before starting maintenance."
            });
        }

        const result = await db.query(
            `
            UPDATE maintenance_requests
            SET

                status = 'IN_PROGRESS',

                started_at = CURRENT_TIMESTAMP,

                updated_at = CURRENT_TIMESTAMP

            WHERE id = $1

            RETURNING *
            `,
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Maintenance started successfully.",
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
// Resolve Maintenance
const resolveMaintenance = async (req, res) => {
    try {

        const { id } = req.params;

        const { resolution_notes } = req.body;

        const requestResult = await db.query(
            `
            SELECT *
            FROM maintenance_requests
            WHERE id = $1
            `,
            [id]
        );

        if (requestResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Maintenance request not found."
            });
        }

        const request = requestResult.rows[0];

        if (request.status !== "IN_PROGRESS") {
            return res.status(400).json({
                success: false,
                message: "Maintenance is not in progress."
            });
        }

        await db.query("BEGIN");

        // Resolve Request
        await db.query(
            `
            UPDATE maintenance_requests
            SET

                status = 'RESOLVED',

                resolved_at = CURRENT_TIMESTAMP,

                resolution_notes = $1,

                updated_at = CURRENT_TIMESTAMP

            WHERE id = $2
            `,
            [
                resolution_notes,
                id
            ]
        );

        // Make Asset Available Again
        await db.query(
            `
            UPDATE assets
            SET

                status = 'AVAILABLE',

                updated_at = CURRENT_TIMESTAMP

            WHERE id = $1
            `,
            [
                request.asset_id
            ]
        );

        await db.query("COMMIT");

        return res.status(200).json({
            success: true,
            message: "Maintenance completed successfully."
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
module.exports = {
    raiseMaintenanceRequest,
    getAllMaintenanceRequests,
    getMaintenanceRequestById,
    approveMaintenanceRequest,
    rejectMaintenanceRequest,
    assignTechnician,
    startMaintenance,
    resolveMaintenance
};