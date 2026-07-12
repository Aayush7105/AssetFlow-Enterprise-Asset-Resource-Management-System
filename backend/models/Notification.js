const db = require("../config/db");

const createNotificationTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS notifications (

      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      user_id UUID NOT NULL,

      title VARCHAR(150) NOT NULL,

      message TEXT NOT NULL,

      type VARCHAR(30) DEFAULT 'GENERAL',

      reference_type VARCHAR(30),

      reference_id UUID,

      is_read BOOLEAN DEFAULT FALSE,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_notification_user
      FOREIGN KEY(user_id)
      REFERENCES users(id)
      ON DELETE CASCADE

    );

    ALTER TABLE notifications
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

    ALTER TABLE notifications
      DROP CONSTRAINT IF EXISTS notifications_type_check;

    ALTER TABLE notifications
      ADD CONSTRAINT notifications_type_check
      CHECK (
        type IN (
          'ASSET_ASSIGNED',
          'ASSET_RETURNED',
          'TRANSFER_REQUEST',
          'TRANSFER_APPROVED',
          'TRANSFER_REJECTED',
          'BOOKING_CONFIRMED',
          'BOOKING_UPDATED',
          'BOOKING_CANCELLED',
          'BOOKING_REMINDER',
          'MAINTENANCE_REQUEST',
          'MAINTENANCE_APPROVED',
          'MAINTENANCE_REJECTED',
          'MAINTENANCE_ASSIGNED',
          'MAINTENANCE_RESOLVED',
          'OVERDUE_RETURN',
          'AUDIT_ASSIGNED',
          'AUDIT_DISCREPANCY',
          'AUDIT_CLOSED',
          'GENERAL'
        )
      );
  `;

  await db.query(query);
};

module.exports = createNotificationTable;
