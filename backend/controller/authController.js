const db = require("../config/db");
const { hashPassword, comparePassword } = require("../utils/hash");
const generateToken = require("../utils/jwt");

const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const emailCheck = await db.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await db.query(
      `
      INSERT INTO users
      (name, email, password, phone)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [name, email, hashedPassword, phone]
    );

    await db.query(
      `
      INSERT INTO user_roles (user_id, role)
      VALUES ($1, 'ADMIN')
      `,
      [user.rows[0].id]
    );

    const token = generateToken(user.rows[0]);

    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
      },
      token,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const userResult = await db.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const user = userResult.rows[0];

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Fetch the user's role
    const roleResult = await db.query(
      `SELECT role FROM user_roles WHERE user_id = $1`,
      [user.id]
    );

    // Update last_login timestamp
    await db.query(
      `UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1`,
      [user.id]
    );

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        department_id: user.department_id,
        status: user.status,
        is_first_login: user.is_first_login,
        role: roleResult.rows[0]?.role || null,
      },
      token,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, old password, and new password are required.",
      });
    }

    const userResult = await db.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const user = userResult.rows[0];

    const isMatch = await comparePassword(oldPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    const hashedNewPassword = await hashPassword(newPassword);

    await db.query(
      `UPDATE users SET password = $1, is_first_login = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [hashedNewPassword, user.id]
    );

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  register,
  login,
  changePassword,
};