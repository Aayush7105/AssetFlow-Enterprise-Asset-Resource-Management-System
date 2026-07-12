const db = require("../config/db");

const createAuditCycleTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS audit_cycles (

      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      title VARCHAR(150) NOT NULL,

      scope_type VARCHAR(20)
      CHECK (
        scope_type IN (
          'DEPARTMENT',
          'LOCATION',
          'ORGANIZATION'
        )
      ) DEFAULT 'DEPARTMENT',

      department_id UUID,

      location VARCHAR(150),

      start_date DATE NOT NULL,

      end_date DATE NOT NULL,

      status VARCHAR(20)
      CHECK (
        status IN (
          'PLANNED',
          'IN_PROGRESS',
          'COMPLETED',
          'CLOSED'
        )
      ) DEFAULT 'PLANNED',

      remarks TEXT,

      created_by UUID NOT NULL,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT chk_audit_dates
      CHECK (end_date >= start_date),

      CONSTRAINT fk_audit_department
      FOREIGN KEY (department_id)
      REFERENCES departments(id)
      ON DELETE SET NULL,

      CONSTRAINT fk_audit_created_by
      FOREIGN KEY (created_by)
      REFERENCES users(id)
      ON DELETE RESTRICT

    );

    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'audit_cycles'
        AND column_name = 'audit_name'
      )
      AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'audit_cycles'
        AND column_name = 'title'
      ) THEN
        ALTER TABLE audit_cycles RENAME COLUMN audit_name TO title;
      END IF;

      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'audit_cycles'
        AND column_name = 'assigned_auditor'
      ) THEN
        ALTER TABLE audit_cycles ALTER COLUMN assigned_auditor DROP NOT NULL;
      END IF;
    END $$;

    ALTER TABLE audit_cycles
      ADD COLUMN IF NOT EXISTS title VARCHAR(150),
      ADD COLUMN IF NOT EXISTS scope_type VARCHAR(20) DEFAULT 'DEPARTMENT',
      ADD COLUMN IF NOT EXISTS department_id UUID,
      ADD COLUMN IF NOT EXISTS location VARCHAR(150),
      ADD COLUMN IF NOT EXISTS start_date DATE,
      ADD COLUMN IF NOT EXISTS end_date DATE,
      ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'PLANNED',
      ADD COLUMN IF NOT EXISTS remarks TEXT,
      ADD COLUMN IF NOT EXISTS created_by UUID,
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

    ALTER TABLE audit_cycles
      ALTER COLUMN title SET NOT NULL,
      ALTER COLUMN start_date SET NOT NULL,
      ALTER COLUMN end_date SET NOT NULL,
      ALTER COLUMN created_by SET NOT NULL;

    CREATE TABLE IF NOT EXISTS audit_cycle_auditors (

      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      audit_cycle_id UUID NOT NULL,

      auditor_id UUID NOT NULL,

      assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_audit_cycle_auditor_cycle
      FOREIGN KEY (audit_cycle_id)
      REFERENCES audit_cycles(id)
      ON DELETE CASCADE,

      CONSTRAINT fk_audit_cycle_auditor_user
      FOREIGN KEY (auditor_id)
      REFERENCES users(id)
      ON DELETE CASCADE,

      CONSTRAINT uq_audit_cycle_auditor
      UNIQUE (audit_cycle_id, auditor_id)

    );
  `;

  await db.query(query);
};

module.exports = createAuditCycleTable;
