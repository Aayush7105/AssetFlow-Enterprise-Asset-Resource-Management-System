const db = require('../config/db');
const createUserTable = async()=>{
    const query = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      name VARCHAR(100) NOT NULL,

      email VARCHAR(150) UNIQUE NOT NULL,

      password VARCHAR(255) NOT NULL,

      phone VARCHAR(15),

      department_id UUID,

      status VARCHAR(20) DEFAULT 'ACTIVE',
      is_first_login BOOLEAN DEFAULT TRUE,

      last_login TIMESTAMP,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await db.query(query);
}
module.exports = createUserTable;