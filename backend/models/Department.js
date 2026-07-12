const db = require("../config/db");

const createDepartmentTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS departments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      name VARCHAR(100) NOT NULL,

      code VARCHAR(20) UNIQUE NOT NULL,

      parent_department_id UUID,

      head_user_id UUID,

      status VARCHAR(20) DEFAULT 'ACTIVE'
      CHECK (status IN ('ACTIVE', 'INACTIVE')),

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_parent_department
        FOREIGN KEY(parent_department_id)
        REFERENCES departments(id)
        ON DELETE SET NULL
    );
  `;

  await db.query(query);
};

module.exports = createDepartmentTable;