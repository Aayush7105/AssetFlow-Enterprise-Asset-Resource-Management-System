const db = require("../config/db");

const createResourceBookingTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS resource_bookings (

      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      asset_id UUID NOT NULL,

      user_id UUID NOT NULL,

      title VARCHAR(150) NOT NULL,

      purpose TEXT,

      start_time TIMESTAMP NOT NULL,

      end_time TIMESTAMP NOT NULL,

      status VARCHAR(20)
      CHECK (
        status IN (
          'UPCOMING',
          'ONGOING',
          'COMPLETED',
          'CANCELLED'
        )
      ) DEFAULT 'UPCOMING',

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT chk_booking_time
      CHECK (end_time > start_time),

      CONSTRAINT fk_booking_asset
      FOREIGN KEY(asset_id)
      REFERENCES assets(id)
      ON DELETE CASCADE,

      CONSTRAINT fk_booking_user
      FOREIGN KEY(user_id)
      REFERENCES users(id)
      ON DELETE CASCADE

    );
  `;

  await db.query(query);
};

module.exports = createResourceBookingTable;