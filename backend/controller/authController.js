const db = require("../config/db");
const { hashPassword } = require("../utils/hash");

const signup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const adminCheck = await db.query(
      `SELECT * FROM user_roles WHERE role = 'ADMIN'`
    );

    if (adminCheck.rows.length > 0) {
      return res.status(403).json({
        success: false,
        message: "Admin already exists.",
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

    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
      },
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
  signup,
};