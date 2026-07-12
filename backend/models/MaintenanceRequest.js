const db = require("../config/db");

const createMaintenanceRequestTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS maintenance_requests (

      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      asset_id UUID NOT NULL,

      raised_by UUID NOT NULL,

      approved_by UUID,

      technician_id UUID,

      issue_description TEXT NOT NULL,

      priority VARCHAR(20)
      CHECK (
        priority IN (
          'LOW',
          'MEDIUM',
          'HIGH',
          'CRITICAL'
        )
      ) DEFAULT 'MEDIUM',

      status VARCHAR(30)
      CHECK (
        status IN (
          'PENDING',
          'APPROVED',
          'REJECTED',
          'TECHNICIAN_ASSIGNED',
          'IN_PROGRESS',
          'RESOLVED'
        )
      ) DEFAULT 'PENDING',

      resolution_notes TEXT,

      attachment_url TEXT,

      requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      approved_at TIMESTAMP,

      started_at TIMESTAMP,

      completed_at TIMESTAMP,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_maintenance_asset
      FOREIGN KEY(asset_id)
      REFERENCES assets(id)
      ON DELETE CASCADE,

      CONSTRAINT fk_maintenance_raised_by
      FOREIGN KEY(raised_by)
      REFERENCES users(id)
      ON DELETE CASCADE,

      CONSTRAINT fk_maintenance_approved_by
      FOREIGN KEY(approved_by)
      REFERENCES users(id)
      ON DELETE SET NULL,

      CONSTRAINT fk_maintenance_technician
      FOREIGN KEY(technician_id)
      REFERENCES users(id)
      ON DELETE SET NULL

    );
  `;

  await db.query(query);
};

module.exports = createMaintenanceRequestTable;