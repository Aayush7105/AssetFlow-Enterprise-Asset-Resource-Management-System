const db = require("../config/db");

const createTransferRequestTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS transfer_requests (

      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      asset_id UUID NOT NULL,

      from_user_id UUID NOT NULL,

      to_user_id UUID NOT NULL,

      requested_by UUID NOT NULL,

      approved_by UUID,

      reason TEXT NOT NULL,

      status VARCHAR(20)
      CHECK (
        status IN (
          'PENDING',
          'APPROVED',
          'REJECTED',
          'COMPLETED'
        )
      ) DEFAULT 'PENDING',

      requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      approved_at TIMESTAMP,

      completed_at TIMESTAMP,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_transfer_asset
      FOREIGN KEY(asset_id)
      REFERENCES assets(id)
      ON DELETE CASCADE,

      CONSTRAINT fk_transfer_from_user
      FOREIGN KEY(from_user_id)
      REFERENCES users(id)
      ON DELETE CASCADE,

      CONSTRAINT fk_transfer_to_user
      FOREIGN KEY(to_user_id)
      REFERENCES users(id)
      ON DELETE CASCADE,

      CONSTRAINT fk_transfer_requested_by
      FOREIGN KEY(requested_by)
      REFERENCES users(id)
      ON DELETE CASCADE,

      CONSTRAINT fk_transfer_approved_by
      FOREIGN KEY(approved_by)
      REFERENCES users(id)
      ON DELETE SET NULL

    );
  `;

  await db.query(query);
};

module.exports = createTransferRequestTable;