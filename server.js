// server.js
require('dotenv').config();

const express = require('express');
const app = express();
const routes = require('./routes/proxy');

const PORT = process.env.PORT || 3000;

app.use(routes);

// Error handler 404
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[server.js] Error:', err);
  res.status(500).send('Internal Server Error');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
