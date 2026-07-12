const db = require("../config/db");

const createAuditCycleTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS audit_cycles (

      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      audit_name VARCHAR(150) NOT NULL,

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

      assigned_auditor UUID NOT NULL,

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

      CONSTRAINT fk_audit_auditor
      FOREIGN KEY (assigned_auditor)
      REFERENCES users(id)
      ON DELETE RESTRICT,

      CONSTRAINT fk_audit_created_by
      FOREIGN KEY (created_by)
      REFERENCES users(id)
      ON DELETE RESTRICT

    );
  `;

  await db.query(query);
};

module.exports = createAuditCycleTable;