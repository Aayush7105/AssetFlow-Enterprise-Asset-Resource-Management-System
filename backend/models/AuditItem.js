const db = require("../config/db");

const createAuditItemTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS audit_items (

      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      audit_cycle_id UUID NOT NULL,

      asset_id UUID NOT NULL,

      auditor_id UUID NOT NULL,

      verification_status VARCHAR(20)
      CHECK (
        verification_status IN (
          'VERIFIED',
          'MISSING',
          'DAMAGED'
        )
      ) NOT NULL,

      remarks TEXT,

      asset_condition VARCHAR(100),

      asset_location VARCHAR(150),

      photo_url TEXT,

      verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_audit_item_cycle
      FOREIGN KEY (audit_cycle_id)
      REFERENCES audit_cycles(id)
      ON DELETE CASCADE,

      CONSTRAINT fk_audit_item_asset
      FOREIGN KEY (asset_id)
      REFERENCES assets(id)
      ON DELETE CASCADE,

      CONSTRAINT fk_audit_item_auditor
      FOREIGN KEY (auditor_id)
      REFERENCES users(id)
      ON DELETE RESTRICT

    );

    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'audit_items'
        AND column_name = 'result'
      )
      AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'audit_items'
        AND column_name = 'verification_status'
      ) THEN
        ALTER TABLE audit_items RENAME COLUMN result TO verification_status;
      END IF;
    END $$;

    ALTER TABLE audit_items
      ADD COLUMN IF NOT EXISTS verification_status VARCHAR(20),
      ADD COLUMN IF NOT EXISTS asset_condition VARCHAR(100),
      ADD COLUMN IF NOT EXISTS asset_location VARCHAR(150);

    ALTER TABLE audit_items
      ALTER COLUMN verification_status SET NOT NULL;
  `;

  await db.query(query);
};

module.exports = createAuditItemTable;
