const db = require("../config/db");

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