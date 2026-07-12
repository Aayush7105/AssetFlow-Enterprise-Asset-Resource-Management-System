const db = require("../config/db");

const createAllocationTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS allocations (

      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      asset_id UUID NOT NULL,

      user_id UUID NOT NULL,

      allocated_by UUID NOT NULL,

      allocated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      expected_return_date DATE,

      actual_return_date DATE,

      return_condition VARCHAR(20)
      CHECK (
        return_condition IN (
          'EXCELLENT',
          'GOOD',
          'FAIR',
          'DAMAGED'
        )
      ),

      return_notes TEXT,

      status VARCHAR(20)
      CHECK (
        status IN (
          'ACTIVE',
          'RETURNED',
          'OVERDUE'
        )
      ) DEFAULT 'ACTIVE',

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_allocation_asset
      FOREIGN KEY(asset_id)
      REFERENCES assets(id)
      ON DELETE CASCADE,

      CONSTRAINT fk_allocation_user
      FOREIGN KEY(user_id)
      REFERENCES users(id)
      ON DELETE CASCADE,

      CONSTRAINT fk_allocated_by
      FOREIGN KEY(allocated_by)
      REFERENCES users(id)
      ON DELETE SET NULL

    );
  `;

  await db.query(query);
};

module.exports = createAllocationTable;