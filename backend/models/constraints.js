const db = require("../config/db");

const addConstraints = async () => {
  try {
    await db.query(`
      ALTER TABLE users
      DROP CONSTRAINT IF EXISTS fk_user_department;

      ALTER TABLE users
      ADD CONSTRAINT fk_user_department
      FOREIGN KEY (department_id)
      REFERENCES departments(id)
      ON DELETE SET NULL;
    `);

    await db.query(`
      ALTER TABLE departments
      DROP CONSTRAINT IF EXISTS fk_department_head;

      ALTER TABLE departments
      ADD CONSTRAINT fk_department_head
      FOREIGN KEY (head_user_id)
      REFERENCES users(id)
      ON DELETE SET NULL;
    `);

    console.log("Foreign key constraints added successfully.");
  } catch (err) {
    console.error("Error adding constraints:", err.message);
  }
};

module.exports = addConstraints;