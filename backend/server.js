const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { query, initSchema } = require('./utils/db');
const app = require('./app');

const PORT = process.env.PORT || 4000;

const seedAdmin = async () => {
  const existing = await query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
  if (existing.rows.length === 0) {
    const hashedPassword = await bcrypt.hash('admin123', 12);
    await query(
      `INSERT INTO users (id, name, email, password, phone, account_number, status, role)
       VALUES ($1, 'Super Admin', 'admin@finapp.com', $2, '', 'FIN-ADMIN001', 'active', 'admin')
       ON CONFLICT (email) DO NOTHING`,
      [uuidv4(), hashedPassword]
    );
    console.log('✅ Admin user seeded: admin@finapp.com / admin123');
  }
};

const start = async () => {
  try {
    await initSchema();
    await seedAdmin();
    app.listen(PORT, () => {
      console.log(`🚀 FinVault API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();
