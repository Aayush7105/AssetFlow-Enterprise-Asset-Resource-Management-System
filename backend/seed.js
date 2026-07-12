require("dotenv").config();
const db = require("./config/db");
const { hashPassword } = require("./utils/hash");

const seedUser = async () => {
    try {
        await db.query("SELECT 1");
        const hashedPassword = await hashPassword("admin123");
        
        const userResult = await db.query(
            `INSERT INTO users (name, email, password, phone) 
             VALUES ($1, $2, $3, $4) RETURNING id`,
            ["Admin User", "admin@assetflow.com", hashedPassword, "1234567890"]
        );

        const userId = userResult.rows[0].id;
        
        await db.query(
            `INSERT INTO user_roles (user_id, role) VALUES ($1, $2)`,
            [userId, "ADMIN"]
        );

        console.log("Demo user created successfully!");
        console.log("Email: admin@assetflow.com");
        console.log("Password: admin123");
    } catch (err) {
        if (err.code === '23505') {
            console.log("User already exists (admin@assetflow.com). Password might be old.");
        } else {
            console.error("Error creating demo user:", err);
        }
    } finally {
        process.exit();
    }
};

seedUser();

