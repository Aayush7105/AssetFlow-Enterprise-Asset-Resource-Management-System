const db = require("../config/db");
const { createActivityLog } = require("../utils/activityLogService");
const { notifyUser } = require("../utils/notificationService");
const createAuditCycle = async (req, res) => {
    try {

        const {
            title,
            department_id,
            location,
            start_date,
            end_date
        } = req.body;

       
        if (
            !title ||
            !start_date ||
            !end_date
        ) {
            return res.status(400).json({
                success: false,
                message: "Title, start date and end date are required."
            });
        }

        if (new Date(start_date) >= new Date(end_date)) {
            return res.status(400).json({
                success: false,
                message: "End date must be greater than start date."
            });
        }

        
        if (department_id) {

            const department = await db.query(
                `
                SELECT id
                FROM departments
                WHERE id = $1
                `,
                [department_id]
            );

            if (department.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Department not found."
                });
            }

        }

        const result = await db.query(
            `
            INSERT INTO audit_cycles
            (
                title,
                department_id,
                location,
                start_date,
                end_date,
                created_by
            )
            VALUES
            (
                $1,$2,$3,$4,$5,$6
            )
            RETURNING *
            `,
            [
                title,
                department_id || null,
                location || null,
                start_date,
                end_date,
                req.user.id
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Audit cycle created successfully.",
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

const getAllAuditCycles = async (req, res) => {
    try {

        const result = await db.query(
            `
            SELECT

                ac.*,

                d.name AS department_name,

                u.name AS created_by_name,

                (
                    SELECT COUNT(*)
                    FROM audit_items ai
                    WHERE ai.audit_cycle_id = ac.id
                ) AS total_assets,

                (
                    SELECT COUNT(*)
                    FROM audit_cycle_auditors aca
                    WHERE aca.audit_cycle_id = ac.id
                ) AS total_auditors

            FROM audit_cycles ac

            LEFT JOIN departments d
                ON ac.department_id = d.id

            INNER JOIN users u
                ON ac.created_by = u.id

            ORDER BY ac.created_at DESC
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
const assignAuditor = async (req, res) => {
    try {

        const { id } = req.params;

        const { auditor_id } = req.body;

        const auditResult = await db.query(
            `
            SELECT *
            FROM audit_cycles
            WHERE id = $1
            `,
            [id]
        );

        if (auditResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Audit cycle not found."
            });
        }

      
        if (auditResult.rows[0].status === "CLOSED") {
            return res.status(400).json({
                success: false,
                message: "Audit cycle is already closed."
            });
        }

        
        const userResult = await db.query(
            `
            SELECT id,status
            FROM users
            WHERE id = $1
            `,
            [auditor_id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Auditor not found."
            });
        }

        if (userResult.rows[0].status !== "ACTIVE") {
            return res.status(400).json({
                success: false,
                message: "Auditor account is inactive."
            });
        }

       
        const assigned = await db.query(
            `
            SELECT id
            FROM audit_cycle_auditors
            WHERE audit_cycle_id = $1
            AND auditor_id = $2
            `,
            [
                id,
                auditor_id
            ]
        );

        if (assigned.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Auditor already assigned."
            });
        }

        const result = await db.query(
            `
            INSERT INTO audit_cycle_auditors
            (
                audit_cycle_id,
                auditor_id
            )
            VALUES
            (
                $1,$2
            )
            RETURNING *
            `,
            [
                id,
                auditor_id
            ]
        );

        await notifyUser({
            user_id: auditor_id,
            title: "Audit assigned",
            message: `You have been assigned to audit ${auditResult.rows[0].title}.`,
            type: "AUDIT_ASSIGNED",
            reference_type: "AUDIT",
            reference_id: id
        });

        return res.status(201).json({
            success: true,
            message: "Auditor assigned successfully.",
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

const verifyAsset = async (req, res) => {
    try {

        const {
            audit_cycle_id,
            asset_id,
            verification_status,
            remarks,
            asset_condition,
            asset_location
        } = req.body;

        
        const auditResult = await db.query(
            `
            SELECT *
            FROM audit_cycles
            WHERE id = $1
            `,
            [audit_cycle_id]
        );

        if (auditResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Audit cycle not found."
            });
        }

        const audit = auditResult.rows[0];

        if (audit.status === "CLOSED") {
            return res.status(400).json({
                success: false,
                message: "Audit cycle is already closed."
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

        const duplicate = await db.query(
            `
            SELECT id
            FROM audit_items
            WHERE audit_cycle_id = $1
            AND asset_id = $2
            `,
            [
                audit_cycle_id,
                asset_id
            ]
        );

        if (duplicate.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Asset already verified in this audit cycle."
            });
        }

       
        const auditor = await db.query(
            `
            SELECT id
            FROM audit_cycle_auditors
            WHERE audit_cycle_id = $1
            AND auditor_id = $2
            `,
            [
                audit_cycle_id,
                req.user.id
            ]
        );

        if (auditor.rows.length === 0) {
            return res.status(403).json({
                success: false,
                message: "You are not assigned to this audit."
            });
        }

        const result = await db.query(
            `
            INSERT INTO audit_items
            (
                audit_cycle_id,
                asset_id,
                auditor_id,
                verification_status,
                remarks,
                asset_condition,
                asset_location,
                verified_at
            )
            VALUES
            (
                $1,$2,$3,$4,$5,$6,$7,CURRENT_TIMESTAMP
            )
            RETURNING *
            `,
            [
                audit_cycle_id,
                asset_id,
                req.user.id,
                verification_status,
                remarks,
                asset_condition,
                asset_location
            ]
        );

        if (verification_status && verification_status !== "VERIFIED") {
            await notifyUser({
                user_id: audit.created_by,
                title: "Audit discrepancy found",
                message: `${assetResult.rows[0].name} was marked ${verification_status}.`,
                type: "AUDIT_DISCREPANCY",
                reference_type: "AUDIT",
                reference_id: audit_cycle_id
            });
        }

        return res.status(201).json({
            success: true,
            message: "Asset verified successfully.",
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
const getAuditItems = async (req, res) => {
    try {

        const { cycleId } = req.params;

        const result = await db.query(
            `
            SELECT

                ai.*,

                a.asset_tag,

                a.name AS asset_name,

                a.location,

                u.name AS auditor_name

            FROM audit_items ai

            INNER JOIN assets a
                ON ai.asset_id = a.id

            INNER JOIN users u
                ON ai.auditor_id = u.id

            WHERE ai.audit_cycle_id = $1

            ORDER BY ai.verified_at DESC
            `,
            [cycleId]
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

const getAuditCycleById = async (req, res) => {
    try {

        const { id } = req.params;

        const result = await db.query(
            `
            SELECT

                ac.*,

                d.name AS department_name,

                u.name AS created_by_name,

                (
                    SELECT COUNT(*)
                    FROM audit_items ai
                    WHERE ai.audit_cycle_id = ac.id
                ) AS total_assets,

                (
                    SELECT COUNT(*)
                    FROM audit_items ai
                    WHERE ai.audit_cycle_id = ac.id
                    AND ai.verification_status = 'VERIFIED'
                ) AS verified_assets,

                (
                    SELECT COUNT(*)
                    FROM audit_cycle_auditors aca
                    WHERE aca.audit_cycle_id = ac.id
                ) AS total_auditors

            FROM audit_cycles ac

            LEFT JOIN departments d
                ON ac.department_id = d.id

            INNER JOIN users u
                ON ac.created_by = u.id

            WHERE ac.id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Audit cycle not found."
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
const closeAuditCycle = async (req, res) => {
    try {

        const { id } = req.params;

        const auditResult = await db.query(
            `
            SELECT *
            FROM audit_cycles
            WHERE id = $1
            `,
            [id]
        );

        if (auditResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Audit cycle not found."
            });
        }

        const audit = auditResult.rows[0];

        if (audit.status === "CLOSED") {
            return res.status(400).json({
                success: false,
                message: "Audit cycle is already closed."
            });
        }

        const result = await db.query(
            `
            UPDATE audit_cycles
            SET

                status = 'CLOSED',

                updated_at = CURRENT_TIMESTAMP

            WHERE id = $1

            RETURNING *
            `,
            [id]
        );
        await createActivityLog({

    user_id:req.user.id,

    action:"AUDIT_CLOSED",

    entity_type:"AUDIT",

    entity_id:id,

    description:"Audit cycle closed."

});

        const auditors = await db.query(
            `
            SELECT auditor_id
            FROM audit_cycle_auditors
            WHERE audit_cycle_id = $1
            `,
            [id]
        );

        await Promise.all(
            auditors.rows.map((auditor) => notifyUser({
                user_id: auditor.auditor_id,
                title: "Audit closed",
                message: `Audit ${audit.title} has been closed.`,
                type: "AUDIT_CLOSED",
                reference_type: "AUDIT",
                reference_id: id
            }))
        );

        await notifyUser({
            user_id: audit.created_by,
            title: "Audit closed",
            message: `Audit ${audit.title} has been closed.`,
            type: "AUDIT_CLOSED",
            reference_type: "AUDIT",
            reference_id: id
        });

        return res.status(200).json({
            success: true,
            message: "Audit cycle closed successfully.",
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
    createAuditCycle,
    getAllAuditCycles, 
    assignAuditor,
    verifyAsset,
    getAuditItems,

    getAuditCycleById,
    closeAuditCycle
};
