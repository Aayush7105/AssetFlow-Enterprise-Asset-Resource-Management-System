const db = require("../config/db");

const createAssetCategoryTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS asset_categories (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      name VARCHAR(100) NOT NULL UNIQUE,

      description TEXT,

      extra_fields_schema JSONB,

      status VARCHAR(20) DEFAULT 'ACTIVE'
      CHECK (status IN ('ACTIVE', 'INACTIVE')),

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await db.query(query);
};

module.exports = createAssetCategoryTable;