require("dotenv").config();
const db = require("./config/db");
const { hashPassword } = require("./utils/hash");

const seedMockData = async () => {
    try {
        await db.query("SELECT 1");
        const hashedPassword = await hashPassword("password123");

        console.log("Seeding departments...");
        const deptResult = await db.query(
            `INSERT INTO departments (name, code) VALUES 
             ('IT Department', 'IT'),
             ('HR Department', 'HR')
             ON CONFLICT (code) DO NOTHING RETURNING id, code`
        );
        let itDeptId = null;
        let hrDeptId = null;
        
        // If they existed, we need to fetch them
        const allDepts = await db.query(`SELECT id, code FROM departments`);
        for (let d of allDepts.rows) {
            if (d.code === 'IT') itDeptId = d.id;
            if (d.code === 'HR') hrDeptId = d.id;
        }

        console.log("Seeding users...");
        const users = [
            { name: "Super Admin", email: "admin@mock.com", role: "ADMIN", dept: itDeptId },
            { name: "IT Manager", email: "manager@mock.com", role: "ASSET_MANAGER", dept: itDeptId },
            { name: "HR Head", email: "hrhead@mock.com", role: "DEPARTMENT_HEAD", dept: hrDeptId },
            { name: "John Doe", email: "john@mock.com", role: "EMPLOYEE", dept: itDeptId },
            { name: "Jane Smith", email: "jane@mock.com", role: "EMPLOYEE", dept: hrDeptId }
        ];

        for (let u of users) {
            try {
                const userRes = await db.query(
                    `INSERT INTO users (name, email, password, phone, department_id) 
                     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
                    [u.name, u.email, hashedPassword, "1234567890", u.dept]
                );
                await db.query(
                    `INSERT INTO user_roles (user_id, role) VALUES ($1, $2)`,
                    [userRes.rows[0].id, u.role]
                );
                console.log(`Created user: ${u.email}`);
            } catch (err) {
                if (err.code === '23505') console.log(`User ${u.email} already exists.`);
                else console.error(`Error creating user ${u.email}:`, err);
            }
        }

        console.log("Seeding asset categories...");
        const catResult = await db.query(
            `INSERT INTO asset_categories (name, description) VALUES 
             ('Laptops', 'Company laptops'),
             ('Smartphones', 'Company phones')
             ON CONFLICT (name) DO NOTHING RETURNING id, name`
        );
        
        const allCats = await db.query(`SELECT id, name FROM asset_categories`);
        let laptopCatId = null;
        for (let c of allCats.rows) {
            if (c.name === 'Laptops') laptopCatId = c.id;
        }

        console.log("Seeding assets...");
        const assets = [
            { tag: "12356", name: "Dell XPS 15", serial: "SN-12356", cond: "NEW" },
            { tag: "AST-002", name: "MacBook Pro M2", serial: "SN-MAC-002", cond: "GOOD" },
            { tag: "AST-003", name: "ThinkPad T14", serial: "SN-TP-003", cond: "FAIR" }
        ];

        for (let a of assets) {
            try {
                await db.query(
                    `INSERT INTO assets (asset_tag, name, category_id, department_id, serial_number, asset_condition, is_bookable, location) 
                     VALUES ($1, $2, $3, $4, $5, $6, TRUE, 'Main Office')`,
                    [a.tag, a.name, laptopCatId, itDeptId, a.serial, a.cond]
                );
                console.log(`Created asset: ${a.tag} - ${a.name}`);
            } catch (err) {
                if (err.code === '23505') console.log(`Asset ${a.tag} already exists.`);
                else console.error(`Error creating asset ${a.tag}:`, err);
            }
        }

        console.log("Mock data seeded successfully!");
    } catch (err) {
        console.error("Error seeding mock data:", err);
    } finally {
        process.exit();
    }
};

seedMockData();
