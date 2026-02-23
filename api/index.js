/**
 * Vercel serverless entry point — wraps the Express backend.
 * All /api/* requests are routed here via vercel.json rewrites.
 */
const bcrypt    = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { query, initSchema } = require('../backend/utils/db');
const app = require('../backend/app');

// Lazy one-time initialisation (survives warm instances)
let ready = false;
let initPromise = null;

const ensureReady = () => {
  if (ready) return Promise.resolve();
  if (!initPromise) {
    initPromise = initSchema()
      .then(async () => {
        const existing = await query(
          "SELECT id FROM users WHERE role = 'admin' LIMIT 1"
        );
        if (existing.rows.length === 0) {
          const hashed = await bcrypt.hash('admin123', 12);
          await query(
            `INSERT INTO users (id,name,email,password,phone,account_number,status,role)
             VALUES ($1,'Super Admin','admin@finapp.com',$2,'','FIN-ADMIN001','active','admin')
             ON CONFLICT (email) DO NOTHING`,
            [uuidv4(), hashed]
          );
        }
      })
      .then(() => { ready = true; })
      .catch(err => {
        // Reset so next invocation retries
        initPromise = null;
        throw err;
      });
  }
  return initPromise;
};

module.exports = async (req, res) => {
  await ensureReady();
  return app(req, res);
};
