const db = require("../config/db");

const createActivityLogTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS activity_logs (

      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      user_id UUID NOT NULL,

      action VARCHAR(100) NOT NULL,

      entity_type VARCHAR(50) NOT NULL,

      entity_id UUID,

      description TEXT,

      ip_address VARCHAR(45),

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_activity_user
      FOREIGN KEY(user_id)
      REFERENCES users(id)
      ON DELETE CASCADE

    );
  `;

  await db.query(query);
};

module.exports = createActivityLogTable;