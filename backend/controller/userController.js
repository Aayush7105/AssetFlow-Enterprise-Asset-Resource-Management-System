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
                req.department_id
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

module.exports = {
    createUser
};