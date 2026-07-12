const db = require("../config/db");

const { hashPassword } = require("../utils/hash");
const generatePassword = require("../utils/passwordGenerator");
const sendMail = require("../utils/mail");
const { welcomeMail } = require("../utils/mailOptions");

const createUser = async (req, res) => {
    try {

        const {
            name,
            email,
            phone,
            department_id,
            role
        } = req.body;

        const existingUser = await db.query(
            `
            SELECT id
            FROM users
            WHERE email = $1
            `,
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already exists."
            });
        }

        const generatedPassword = generatePassword();

       
        const hashedPassword = await hashPassword(generatedPassword);

      
        const user = await db.query(
            `
            INSERT INTO users
            (
                name,
                email,
                password,
                phone,
                department_id
            )
            VALUES
            (
                $1,$2,$3,$4,$5
            )
            RETURNING *
            `,
            [
                name,
                email,
                hashedPassword,
                phone,
                department_id
            ]
        );

        await db.query(
            `
            INSERT INTO user_roles
            (
                user_id,
                role,
                assigned_by
            )
            VALUES
            (
                $1,$2,$3
            )
            `,
            [
                user.rows[0].id,
                role,
                req.user.id
            ]
        );

        
        const mail = welcomeMail(
            user.rows[0].name,
            user.rows[0].email,
            generatedPassword
        );

        await sendMail({
            to: user.rows[0].email,
            subject: mail.subject,
            html: mail.html
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully.",
            data: {
                id: user.rows[0].id,
                name: user.rows[0].name,
                email: user.rows[0].email,
                role
            }
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

const getAllUsers = async (req, res) => {
    try {
        const result = await db.query(
            `
            SELECT
                u.id,
                u.name,
                u.email,
                u.phone,
                u.department_id,
                u.status,
                u.is_first_login,
                u.created_at,
                d.name AS department_name,
                ur.role
            FROM users u
            LEFT JOIN departments d
            ON u.department_id = d.id
            LEFT JOIN LATERAL (
                SELECT role
                FROM user_roles
                WHERE user_id = u.id
                ORDER BY assigned_at DESC
                LIMIT 1
            ) ur ON true
            ORDER BY u.created_at DESC
            `
        );

        return res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            email,
            phone,
            department_id,
            status,
            role
        } = req.body;

        const result = await db.query(
            `
            UPDATE users
            SET
                name = $1,
                email = $2,
                phone = $3,
                department_id = $4,
                status = $5,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $6
            RETURNING id, name, email, phone, department_id, status, is_first_login, created_at
            `,
            [
                name,
                email,
                phone || null,
                department_id || null,
                status || "ACTIVE",
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        if (role) {
            await db.query(
                `
                INSERT INTO user_roles
                (
                    user_id,
                    role,
                    assigned_by
                )
                VALUES
                (
                    $1,$2,$3
                )
                `,
                [
                    id,
                    role,
                    req.user.id
                ]
            );
        }

        return res.status(200).json({
            success: true,
            message: "User updated successfully.",
            data: {
                ...result.rows[0],
                role
            }
        });
    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            `
            UPDATE users
            SET
                status = 'INACTIVE',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING id
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "User deactivated successfully."
        });
    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
module.exports = {
    createUser,
    getAllUsers,
    updateUser,
    deleteUser
};

