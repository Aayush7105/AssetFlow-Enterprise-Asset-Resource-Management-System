const db = require("../config/db");


const createDepartment = async (req, res) => {
    try {

        const {
            name,
            code,
            parent_department_id,
            head_user_id
        } = req.body;

        const department = await db.query(
            `
            SELECT id
            FROM departments
            WHERE code = $1
            `,
            [code]
        );

        if (department.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Department code already exists."
            });
        }

        const result = await db.query(
            `
            INSERT INTO departments
            (
                name,
                code,
                parent_department_id,
                head_user_id
            )
            VALUES
            (
                $1,$2,$3,$4
            )
            RETURNING *
            `,
            [
                name,
                code,
                parent_department_id || null,
                head_user_id || null
            ]
        );

        res.status(201).json({
            success: true,
            message: "Department created successfully.",
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

const getAllDepartments = async (req, res) => {
    try {

        const result = await db.query(`
            SELECT
                d.*,
                u.name AS department_head
            FROM departments d
            LEFT JOIN users u
            ON d.head_user_id = u.id
            ORDER BY d.created_at DESC
        `);

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

const getDepartmentById = async (req, res) => {
    try {

        const { id } = req.params;

        const result = await db.query(
            `
            SELECT
                d.*,
                u.name AS department_head
            FROM departments d
            LEFT JOIN users u
            ON d.head_user_id = u.id
            WHERE d.id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Department not found."
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

const updateDepartment = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            name,
            code,
            parent_department_id,
            head_user_id,
            status
        } = req.body;

        const result = await db.query(
            `
            UPDATE departments
            SET
                name = $1,
                code = $2,
                parent_department_id = $3,
                head_user_id = $4,
                status = $5,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $6
            RETURNING *
            `,
            [
                name,
                code,
                parent_department_id || null,
                head_user_id || null,
                status,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Department not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Department updated successfully.",
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
const deleteDepartment = async (req, res) => {
    try {

        const { id } = req.params;

        const result = await db.query(
            `
            UPDATE departments
            SET
                status = 'INACTIVE',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Department not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Department deactivated successfully."
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};
const assignDepartmentHead = async (req, res) => {
    try {

        const { id } = req.params;
        const { head_user_id } = req.body;

        const result = await db.query(
            `
            UPDATE departments
            SET
                head_user_id = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *
            `,
            [
                head_user_id,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Department not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Department head assigned successfully.",
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

module.exports = {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
    assignDepartmentHead
};