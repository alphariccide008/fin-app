const express = require('express');
const cors    = require('cors');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '20mb' }));

app.use('/api/auth',         require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/admin',        require('./routes/admin'));
app.use('/api/messages',     require('./routes/messages'));

app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

module.exports = app;
