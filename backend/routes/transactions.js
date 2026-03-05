const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { query, getClient, mapTx } = require('../utils/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /api/transactions — user's own transactions
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows.map(mapTx));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/transactions/transfer
router.post('/transfer', authenticate, async (req, res) => {
  const pg = await getClient();
  try {
    const { recipientIdentifier, amount, description } = req.body;
    const transferAmount = parseFloat(amount);

    if (!recipientIdentifier || !transferAmount || transferAmount <= 0) {
      return res.status(400).json({ message: 'Recipient and valid amount are required' });
    }

    await pg.query('BEGIN');

    // Lock sender row
    const senderRes = await pg.query('SELECT * FROM users WHERE id = $1 FOR UPDATE', [req.user.id]);
    const senderRow = senderRes.rows[0];
    const senderBalance = parseFloat(senderRow.available_balance);

    if (senderBalance < transferAmount) {
      await pg.query('ROLLBACK');
      return res.status(400).json({ message: 'Insufficient available balance' });
    }

    // Find recipient
    const recipientRes = await pg.query(
      'SELECT * FROM users WHERE account_number = $1 OR email = $2 FOR UPDATE',
      [recipientIdentifier, recipientIdentifier.toLowerCase()]
    );
    if (recipientRes.rows.length === 0) {
      await pg.query('ROLLBACK');
      return res.status(404).json({ message: 'Recipient not found' });
    }
    const recipientRow = recipientRes.rows[0];
    if (recipientRow.id === senderRow.id) {
      await pg.query('ROLLBACK');
      return res.status(400).json({ message: 'Cannot transfer to yourself' });
    }
    if (recipientRow.status !== 'active') {
      await pg.query('ROLLBACK');
      return res.status(400).json({ message: 'Recipient account is not active' });
    }

    const now = new Date().toISOString();
    const reference = `TRF-${Date.now()}`;
    const newSenderBal = parseFloat((senderBalance - transferAmount).toFixed(2));
    const newSenderLedger = parseFloat((parseFloat(senderRow.ledger_balance) - transferAmount).toFixed(2));
    const newRecipientBal = parseFloat((parseFloat(recipientRow.available_balance) + transferAmount).toFixed(2));
    const newRecipientLedger = parseFloat((parseFloat(recipientRow.ledger_balance) + transferAmount).toFixed(2));

    await pg.query('UPDATE users SET available_balance=$1, ledger_balance=$2 WHERE id=$3',
      [newSenderBal, newSenderLedger, senderRow.id]);
    await pg.query('UPDATE users SET available_balance=$1, ledger_balance=$2 WHERE id=$3',
      [newRecipientBal, newRecipientLedger, recipientRow.id]);

    const senderTxId = uuidv4();
    const senderDesc = description || `Transfer to ${recipientRow.name}`;
    await pg.query(
      `INSERT INTO transactions(id,user_id,type,amount,description,counterparty,counterparty_account,status,balance_after,reference,created_at)
       VALUES($1,$2,'debit',$3,$4,$5,$6,'completed',$7,$8,$9)`,
      [senderTxId, senderRow.id, transferAmount, senderDesc, recipientRow.name, recipientRow.account_number, newSenderBal, reference, now]
    );
    await pg.query(
      `INSERT INTO transactions(id,user_id,type,amount,description,counterparty,counterparty_account,status,balance_after,reference,created_at)
       VALUES($1,$2,'credit',$3,$4,$5,$6,'completed',$7,$8,$9)`,
      [uuidv4(), recipientRow.id, transferAmount, description || `Transfer from ${senderRow.name}`, senderRow.name, senderRow.account_number, newRecipientBal, reference, now]
    );

    await pg.query('COMMIT');

    res.json({
      message: 'Transfer successful',
      transaction: { id: senderTxId, type: 'debit', amount: transferAmount, description: senderDesc, reference, createdAt: now },
      newBalance: newSenderBal,
    });
  } catch (err) {
    await pg.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    pg.release();
  }
});

// POST /api/transactions/external-transfer  — send to an external bank
router.post('/external-transfer', authenticate, async (req, res) => {
  const pg = await getClient();
  try {
    const { bankName, routingNumber, accountNumber, accountType, amount, description } = req.body;
    const transferAmount = parseFloat(amount);

    if (!bankName || !routingNumber || !accountNumber || !transferAmount || transferAmount <= 0) {
      return res.status(400).json({ message: 'Bank name, routing number, account number, and valid amount are required' });
    }
    if (!/^\d{9}$/.test(routingNumber)) {
      return res.status(400).json({ message: 'Routing number must be exactly 9 digits' });
    }

    await pg.query('BEGIN');

    const senderRes = await pg.query('SELECT * FROM users WHERE id = $1 FOR UPDATE', [req.user.id]);
    const senderRow = senderRes.rows[0];
    const senderBalance = parseFloat(senderRow.available_balance);

    if (senderBalance < transferAmount) {
      await pg.query('ROLLBACK');
      return res.status(400).json({ message: 'Insufficient available balance' });
    }

    const newBal = parseFloat((senderBalance - transferAmount).toFixed(2));
    const newLedger = parseFloat((parseFloat(senderRow.ledger_balance) - transferAmount).toFixed(2));

    await pg.query('UPDATE users SET available_balance=$1, ledger_balance=$2 WHERE id=$3',
      [newBal, newLedger, senderRow.id]);

    const now = new Date().toISOString();
    const reference = `EXT-${Date.now()}`;
    const txId = uuidv4();
    const counterpartyLabel = `${bankName} ****${accountNumber.slice(-4)}`;
    const desc = description || `External transfer to ${bankName}`;

    await pg.query(
      `INSERT INTO transactions(id,user_id,type,amount,description,counterparty,counterparty_account,status,balance_after,reference,created_at)
       VALUES($1,$2,'debit',$3,$4,$5,$6,'pending',$7,$8,$9)`,
      [txId, senderRow.id, transferAmount, desc, counterpartyLabel,
       `${routingNumber}/${accountNumber}/${accountType || 'Checking'}`, newBal, reference, now]
    );

    await pg.query('COMMIT');

    res.json({
      message: 'External transfer submitted successfully',
      transaction: { id: txId, type: 'debit', amount: transferAmount, description: desc, reference, createdAt: now },
      newBalance: newBal,
    });
  } catch (err) {
    await pg.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    pg.release();
  }
});

module.exports = router;
