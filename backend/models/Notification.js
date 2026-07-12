const db = require("../config/db");

const createNotificationTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS notifications (

      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      user_id UUID NOT NULL,

      title VARCHAR(150) NOT NULL,

      message TEXT NOT NULL,

      type VARCHAR(30)
      CHECK (
        type IN (
          'ASSET_ASSIGNED',
          'ASSET_RETURNED',
          'TRANSFER_REQUEST',
          'TRANSFER_APPROVED',
          'BOOKING_CONFIRMED',
          'BOOKING_CANCELLED',
          'BOOKING_REMINDER',
          'MAINTENANCE_REQUEST',
          'MAINTENANCE_APPROVED',
          'MAINTENANCE_REJECTED',
          'OVERDUE_RETURN',
          'AUDIT_ASSIGNED',
          'AUDIT_DISCREPANCY',
          'GENERAL'
        )
      ) DEFAULT 'GENERAL',

      reference_type VARCHAR(30),

      reference_id UUID,

      is_read BOOLEAN DEFAULT FALSE,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_notification_user
      FOREIGN KEY(user_id)
      REFERENCES users(id)
      ON DELETE CASCADE

    );
  `;

  await db.query(query);
};

module.exports = createNotificationTable;