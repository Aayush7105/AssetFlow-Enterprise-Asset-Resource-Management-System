const db = require("../config/db");

const createMaintenanceRequestTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS maintenance_requests (

      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      asset_id UUID NOT NULL,

      reported_by UUID NOT NULL,

      approved_by UUID,

      technician_id UUID,

      issue TEXT NOT NULL,

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

      resolved_at TIMESTAMP,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_maintenance_asset
      FOREIGN KEY(asset_id)
      REFERENCES assets(id)
      ON DELETE CASCADE,

      CONSTRAINT fk_maintenance_reported_by
      FOREIGN KEY(reported_by)
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

    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'maintenance_requests'
        AND column_name = 'raised_by'
      )
      AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'maintenance_requests'
        AND column_name = 'reported_by'
      ) THEN
        ALTER TABLE maintenance_requests RENAME COLUMN raised_by TO reported_by;
      END IF;

      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'maintenance_requests'
        AND column_name = 'issue_description'
      )
      AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'maintenance_requests'
        AND column_name = 'issue'
      ) THEN
        ALTER TABLE maintenance_requests RENAME COLUMN issue_description TO issue;
      END IF;

      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'maintenance_requests'
        AND column_name = 'completed_at'
      )
      AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'maintenance_requests'
        AND column_name = 'resolved_at'
      ) THEN
        ALTER TABLE maintenance_requests RENAME COLUMN completed_at TO resolved_at;
      END IF;
    END $$;

    ALTER TABLE maintenance_requests
      ADD COLUMN IF NOT EXISTS reported_by UUID,
      ADD COLUMN IF NOT EXISTS issue TEXT,
      ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMP;

    ALTER TABLE maintenance_requests
      ALTER COLUMN reported_by SET NOT NULL,
      ALTER COLUMN issue SET NOT NULL;
  `;

  await db.query(query);
};

module.exports = createMaintenanceRequestTable;
