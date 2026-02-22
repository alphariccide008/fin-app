const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { query, mapUser, mapUserPublic } = require('../utils/db');
const { authenticate, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

const generateAccountNumber = () => {
  const digits = Math.floor(10000000 + Math.random() * 90000000).toString();
  return `FIN-${digits}`;
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, ssn, idFront, idBack } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const id = uuidv4();
    const accountNumber = generateAccountNumber();

    await query(
      `INSERT INTO users (id, name, email, password, phone, account_number, status, role, ssn, id_front, id_back)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending', 'user', $7, $8, $9)`,
      [id, name.trim(), email.toLowerCase().trim(), hashedPassword,
       phone || '', accountNumber, ssn || '', idFront || '', idBack || '']
    );

    res.status(201).json({
      message: 'Registration successful. Awaiting admin approval before you can log in.',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = mapUser(result.rows[0]);
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.status === 'pending') {
      return res.status(403).json({
        message: 'Your account is pending approval. Please wait for an admin to activate your account.',
        status: 'pending',
      });
    }
    if (user.status === 'suspended') {
      return res.status(403).json({
        message: 'Your account has been suspended. Please contact support.',
        status: 'suspended',
      });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, (req, res) => {
  const { password: _, ...userWithoutPassword } = req.user;
  res.json(userWithoutPassword);
});

// PUT /api/auth/me/balance  — user can update their own balances
router.put('/me/balance', authenticate, async (req, res) => {
  const { availableBalance, ledgerBalance } = req.body;
  try {
    const setParts = [];
    const vals = [];
    let idx = 1;
    if (availableBalance !== undefined && !isNaN(parseFloat(availableBalance))) {
      setParts.push(`available_balance=$${idx++}`);
      vals.push(parseFloat(availableBalance));
    }
    if (ledgerBalance !== undefined && !isNaN(parseFloat(ledgerBalance))) {
      setParts.push(`ledger_balance=$${idx++}`);
      vals.push(parseFloat(ledgerBalance));
    }
    if (setParts.length === 0) return res.status(400).json({ message: 'Nothing to update' });
    vals.push(req.user.id);
    const result = await query(
      `UPDATE users SET ${setParts.join(', ')} WHERE id=$${idx} RETURNING *`,
      vals
    );
    const u = mapUser(result.rows[0]);
    delete u.password;
    res.json({ message: 'Balance updated', user: u });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
