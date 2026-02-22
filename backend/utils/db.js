const { Pool } = require('pg');

const DB_URL = process.env.DATABASE_URL ||
  'postgresql://financial_app_l8jw_user:pYka3ELePazQFROEa6f1F4sCw2CeKOnM@dpg-d6d2pafpm1nc739i9a5g-a.oregon-postgres.render.com/financial_app_l8jw';

const pool = new Pool({
  connectionString: DB_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL client error', err);
});

const query = (text, params) => pool.query(text, params);
const getClient = () => pool.connect();

const initSchema = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT DEFAULT '',
      account_number TEXT UNIQUE NOT NULL,
      status TEXT DEFAULT 'pending',
      role TEXT DEFAULT 'user',
      available_balance NUMERIC(15,2) DEFAULT 0,
      ledger_balance NUMERIC(15,2) DEFAULT 0,
      savings_balance NUMERIC(15,2) DEFAULT 0,
      current_balance NUMERIC(15,2) DEFAULT 0,
      ssn TEXT DEFAULT '',
      id_front TEXT DEFAULT '',
      id_back TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      amount NUMERIC(15,2) NOT NULL,
      description TEXT DEFAULT '',
      counterparty TEXT DEFAULT '',
      counterparty_account TEXT DEFAULT '',
      status TEXT DEFAULT 'completed',
      balance_after NUMERIC(15,2) DEFAULT 0,
      reference TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS messages (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      sender_role TEXT NOT NULL DEFAULT 'user',
      content TEXT NOT NULL,
      is_read BOOLEAN DEFAULT FALSE,
      read_by_user BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_tx_user_id ON transactions(user_id);
    CREATE INDEX IF NOT EXISTS idx_tx_created ON transactions(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_msg_user_id ON messages(user_id);
    CREATE INDEX IF NOT EXISTS idx_msg_created ON messages(created_at ASC);
  `);

  /* Add new columns to existing installs that pre-date the schema update */
  const alterations = [
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS savings_balance NUMERIC(15,2) DEFAULT 0`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS current_balance NUMERIC(15,2) DEFAULT 0`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS ssn TEXT DEFAULT ''`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS id_front TEXT DEFAULT ''`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS id_back TEXT DEFAULT ''`,
    // TRUE default for existing rows so they don't generate false unread notifications
    `ALTER TABLE messages ADD COLUMN IF NOT EXISTS read_by_user BOOLEAN DEFAULT TRUE`,
  ];
  for (const sql of alterations) {
    await pool.query(sql).catch(() => {});
  }

  console.log('✅ Database schema ready');
};

const mapUser = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  password: row.password,
  phone: row.phone,
  accountNumber: row.account_number,
  status: row.status,
  role: row.role,
  availableBalance: parseFloat(row.available_balance) || 0,
  ledgerBalance: parseFloat(row.ledger_balance) || 0,
  savingsBalance: parseFloat(row.savings_balance) || 0,
  currentBalance: parseFloat(row.current_balance) || 0,
  ssn: row.ssn || '',
  idFront: row.id_front || '',
  idBack: row.id_back || '',
  createdAt: row.created_at,
});

const mapTx = (row) => ({
  id: row.id,
  userId: row.user_id,
  type: row.type,
  amount: parseFloat(row.amount),
  description: row.description,
  counterparty: row.counterparty,
  counterpartyAccount: row.counterparty_account,
  status: row.status,
  balanceAfter: parseFloat(row.balance_after),
  reference: row.reference,
  createdAt: row.created_at,
  ...(row.user_name !== undefined ? { userName: row.user_name, userEmail: row.user_email } : {}),
});

module.exports = { query, getClient, initSchema, mapUser, mapTx };
