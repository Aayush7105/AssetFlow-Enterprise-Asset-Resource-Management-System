const db = require("../config/db");

const createAuditItemTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS audit_items (

      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      audit_cycle_id UUID NOT NULL,

      asset_id UUID NOT NULL,

      auditor_id UUID NOT NULL,

      result VARCHAR(20)
      CHECK (
        result IN (
          'VERIFIED',
          'MISSING',
          'DAMAGED'
        )
      ) NOT NULL,

      remarks TEXT,

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
  `;

  await db.query(query);
};

module.exports = createAuditItemTable;