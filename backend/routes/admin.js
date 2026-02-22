const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { query, mapUser, mapTx } = require('../utils/db');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate, requireAdmin);

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const result = await query('SELECT * FROM users ORDER BY created_at DESC');
    res.json(result.rows.map(row => {
      const u = mapUser(row);
      delete u.password;
      return u;
    }));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/users/:id — full user detail (includes SSN + ID images + transactions)
router.get('/users/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM users WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    const u = mapUser(result.rows[0]);
    delete u.password;

    const txResult = await query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
      [req.params.id]
    );
    u.transactions = txResult.rows.map(mapTx);

    res.json(u);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/admin/users/:id — update user profile info
router.put('/users/:id', async (req, res) => {
  const { name, email, phone, role } = req.body;
  try {
    const check = await query('SELECT id FROM users WHERE id = $1', [req.params.id]);
    if (check.rows.length === 0) return res.status(404).json({ message: 'User not found' });

    // Email uniqueness check (exclude current user)
    if (email) {
      const emailCheck = await query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email.toLowerCase().trim(), req.params.id]
      );
      if (emailCheck.rows.length > 0) {
        return res.status(409).json({ message: 'Email is already in use by another account' });
      }
    }

    const setParts = [];
    const vals = [];
    let idx = 1;
    if (name)  { setParts.push(`name=$${idx++}`);  vals.push(name.trim()); }
    if (email) { setParts.push(`email=$${idx++}`); vals.push(email.toLowerCase().trim()); }
    if (phone !== undefined) { setParts.push(`phone=$${idx++}`); vals.push(phone.trim()); }
    if (role && ['user', 'admin'].includes(role)) { setParts.push(`role=$${idx++}`); vals.push(role); }

    if (setParts.length === 0) return res.status(400).json({ message: 'Nothing to update' });
    vals.push(req.params.id);

    const result = await query(
      `UPDATE users SET ${setParts.join(', ')} WHERE id=$${idx} RETURNING *`,
      vals
    );
    const u = mapUser(result.rows[0]);
    delete u.password;
    res.json({ message: 'User updated', user: u });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/admin/users/:id/status
router.put('/users/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!['active', 'pending', 'suspended'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  try {
    const check = await query('SELECT role FROM users WHERE id = $1', [req.params.id]);
    if (check.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    if (check.rows[0].role === 'admin') return res.status(403).json({ message: 'Cannot change admin status' });

    const result = await query(
      'UPDATE users SET status=$1 WHERE id=$2 RETURNING *',
      [status, req.params.id]
    );
    const u = mapUser(result.rows[0]);
    delete u.password;
    res.json({ message: `User status updated to ${status}`, user: u });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/admin/users/:id/balance
router.put('/users/:id/balance', async (req, res) => {
  const { availableBalance, ledgerBalance, savingsBalance, currentBalance } = req.body;
  try {
    const setParts = [];
    const vals = [];
    let idx = 1;
    if (availableBalance !== undefined) { setParts.push(`available_balance=$${idx++}`); vals.push(parseFloat(availableBalance)); }
    if (ledgerBalance !== undefined) { setParts.push(`ledger_balance=$${idx++}`); vals.push(parseFloat(ledgerBalance)); }
    if (savingsBalance !== undefined) { setParts.push(`savings_balance=$${idx++}`); vals.push(parseFloat(savingsBalance)); }
    if (currentBalance !== undefined) { setParts.push(`current_balance=$${idx++}`); vals.push(parseFloat(currentBalance)); }
    if (setParts.length === 0) return res.status(400).json({ message: 'Nothing to update' });
    vals.push(req.params.id);

    const result = await query(
      `UPDATE users SET ${setParts.join(', ')} WHERE id=$${idx} RETURNING *`,
      vals
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    const u = mapUser(result.rows[0]);
    delete u.password;
    res.json({ message: 'Balance updated', user: u });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/transactions
router.get('/transactions', async (req, res) => {
  try {
    const result = await query(`
      SELECT t.*, u.name AS user_name, u.email AS user_email
      FROM transactions t
      LEFT JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
    `);
    res.json(result.rows.map(mapTx));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/admin/transactions — add manual transaction
router.post('/transactions', async (req, res) => {
  try {
    const { userId, type, amount, description, counterparty, status, createdAt } = req.body;
    const txAmount = parseFloat(amount);

    if (!userId || !type || !txAmount || txAmount <= 0) {
      return res.status(400).json({ message: 'userId, type, and valid amount are required' });
    }
    if (!['credit', 'debit'].includes(type)) {
      return res.status(400).json({ message: 'type must be credit or debit' });
    }

    // Adjust user balance
    const balField = type === 'credit'
      ? `available_balance = available_balance + ${txAmount}, ledger_balance = ledger_balance + ${txAmount}`
      : `available_balance = available_balance - ${txAmount}, ledger_balance = ledger_balance - ${txAmount}`;

    const userResult = await query(
      `UPDATE users SET ${balField} WHERE id=$1 RETURNING available_balance`,
      [userId]
    );
    if (userResult.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    const newBalance = parseFloat(userResult.rows[0].available_balance);

    const id = uuidv4();
    const reference = `ADM-${Date.now()}`;
    const txDate = createdAt ? new Date(createdAt).toISOString() : new Date().toISOString();

    const txResult = await query(
      `INSERT INTO transactions(id,user_id,type,amount,description,counterparty,counterparty_account,status,balance_after,reference,created_at)
       VALUES($1,$2,$3,$4,$5,$6,'ADMIN',$7,$8,$9,$10) RETURNING *`,
      [id, userId, type, txAmount, description || (type === 'credit' ? 'Credit (Admin)' : 'Debit (Admin)'),
       counterparty || 'Admin', status || 'completed', newBalance, reference, txDate]
    );

    res.status(201).json({ message: 'Transaction added', transaction: mapTx(txResult.rows[0]) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/admin/transactions/:id
router.delete('/transactions/:id', async (req, res) => {
  try {
    const result = await query('DELETE FROM transactions WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [usersRes, txRes] = await Promise.all([
      query(`SELECT status, COUNT(*) FROM users WHERE role != 'admin' GROUP BY status`),
      query(`SELECT COUNT(*), SUM(CASE WHEN type='credit' THEN amount ELSE 0 END) as volume FROM transactions`),
    ]);

    const statusMap = {};
    usersRes.rows.forEach(r => { statusMap[r.status] = parseInt(r.count); });
    const totalUsers = Object.values(statusMap).reduce((s, v) => s + v, 0);

    res.json({
      totalUsers,
      pendingUsers: statusMap.pending || 0,
      activeUsers: statusMap.active || 0,
      totalTransactions: parseInt(txRes.rows[0].count) || 0,
      totalVolume: parseFloat(txRes.rows[0].volume) || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
