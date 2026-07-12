const db = require("../config/db");

const createUserRoleTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS user_roles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      user_id UUID NOT NULL,

      role VARCHAR(30) NOT NULL CHECK (
        role IN (
          'ADMIN',
          'ASSET_MANAGER',
          'DEPARTMENT_HEAD',
          'EMPLOYEE'
        )
      ),

      assigned_by UUID,

      assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

      CONSTRAINT fk_assigned_by
        FOREIGN KEY(assigned_by)
        REFERENCES users(id)
        ON DELETE SET NULL
    );
  `;

  await db.query(query);
};

module.exports = createUserRoleTable;