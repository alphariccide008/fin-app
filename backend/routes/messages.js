const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../utils/db');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

/* ── USER ROUTES ── */

// GET /api/messages/unread-count  — count of unread admin replies for the logged-in user
router.get('/unread-count', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT COUNT(*) FROM messages WHERE user_id = $1 AND sender_role = 'admin' AND read_by_user = FALSE`,
      [req.user.id]
    );
    res.json({ count: parseInt(result.rows[0].count) || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/messages  — logged-in user's full conversation with admin (also marks admin messages as read)
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM messages WHERE user_id = $1 ORDER BY created_at ASC',
      [req.user.id]
    );
    // Mark all admin messages as read by user
    await query(
      `UPDATE messages SET read_by_user = TRUE WHERE user_id = $1 AND sender_role = 'admin'`,
      [req.user.id]
    );
    res.json(result.rows.map(r => ({
      id: r.id,
      userId: r.user_id,
      senderRole: r.sender_role,
      content: r.content,
      isRead: r.is_read,
      createdAt: r.created_at,
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/messages  — user sends a message to admin
router.post('/', authenticate, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ message: 'Message content is required' });

    const id = uuidv4();
    const result = await query(
      `INSERT INTO messages (id, user_id, sender_role, content) VALUES ($1, $2, 'user', $3) RETURNING *`,
      [id, req.user.id, content.trim()]
    );
    const r = result.rows[0];
    res.status(201).json({
      id: r.id, userId: r.user_id, senderRole: r.sender_role,
      content: r.content, isRead: r.is_read, createdAt: r.created_at,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ── ADMIN ROUTES ── */

// GET /api/messages/admin/unread-count  — total unread user messages across all conversations
router.get('/admin/unread-count', authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await query(
      `SELECT COUNT(*) FROM messages WHERE sender_role = 'user' AND is_read = FALSE`
    );
    res.json({ count: parseInt(result.rows[0].count) || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/messages/admin/conversations  — all users who have sent messages
router.get('/admin/conversations', authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await query(`
      SELECT * FROM (
        SELECT DISTINCT ON (m.user_id)
          m.user_id, m.content AS last_message, m.created_at AS last_at,
          u.name AS user_name, u.email AS user_email, u.account_number,
          (SELECT COUNT(*) FROM messages WHERE user_id = m.user_id AND sender_role = 'user' AND is_read = FALSE) AS unread_count
        FROM messages m
        JOIN users u ON u.id = m.user_id
        ORDER BY m.user_id, m.created_at DESC
      ) sub
      ORDER BY last_at DESC
    `);
    res.json(result.rows.map(r => ({
      userId: r.user_id,
      userName: r.user_name,
      userEmail: r.user_email,
      accountNumber: r.account_number,
      lastMessage: r.last_message,
      lastAt: r.last_at,
      unreadCount: parseInt(r.unread_count) || 0,
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/messages/admin/:userId  — full conversation with a specific user
router.get('/admin/:userId', authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM messages WHERE user_id = $1 ORDER BY created_at ASC',
      [req.params.userId]
    );
    // Mark all user messages as read
    await query(
      `UPDATE messages SET is_read = TRUE WHERE user_id = $1 AND sender_role = 'user'`,
      [req.params.userId]
    );
    res.json(result.rows.map(r => ({
      id: r.id, userId: r.user_id, senderRole: r.sender_role,
      content: r.content, isRead: r.is_read, createdAt: r.created_at,
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/messages/admin/:userId  — admin replies to a user
router.post('/admin/:userId', authenticate, requireAdmin, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ message: 'Message content is required' });

    const userCheck = await query('SELECT id FROM users WHERE id = $1', [req.params.userId]);
    if (userCheck.rows.length === 0) return res.status(404).json({ message: 'User not found' });

    const id = uuidv4();
    const result = await query(
      `INSERT INTO messages (id, user_id, sender_role, content) VALUES ($1, $2, 'admin', $3) RETURNING *`,
      [id, req.params.userId, content.trim()]
    );
    const r = result.rows[0];
    res.status(201).json({
      id: r.id, userId: r.user_id, senderRole: r.sender_role,
      content: r.content, isRead: r.is_read, createdAt: r.created_at,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
