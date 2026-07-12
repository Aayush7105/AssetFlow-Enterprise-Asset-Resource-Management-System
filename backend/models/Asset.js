const db = require("../config/db");

const createAssetTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS assets (

      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      asset_tag VARCHAR(30) UNIQUE NOT NULL,

      name VARCHAR(150) NOT NULL,

      category_id UUID NOT NULL,

      department_id UUID,

      serial_number VARCHAR(100) UNIQUE,

      acquisition_date DATE,

      acquisition_cost DECIMAL(12,2),

      asset_condition VARCHAR(20)
      CHECK (
        asset_condition IN (
          'NEW',
          'GOOD',
          'FAIR',
          'DAMAGED'
        )
      ) DEFAULT 'GOOD',

      location VARCHAR(150),

      is_bookable BOOLEAN DEFAULT FALSE,

      status VARCHAR(30)
      CHECK (
        status IN (
          'AVAILABLE',
          'ALLOCATED',
          'RESERVED',
          'UNDER_MAINTENANCE',
          'LOST',
          'RETIRED',
          'DISPOSED'
        )
      ) DEFAULT 'AVAILABLE',

      photo_url TEXT,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_asset_category
      FOREIGN KEY(category_id)
      REFERENCES asset_categories(id)
      ON DELETE RESTRICT,

      CONSTRAINT fk_asset_department
      FOREIGN KEY(department_id)
      REFERENCES departments(id)
      ON DELETE SET NULL

    );
  `;

  await db.query(query);
};

module.exports = createAssetTable;