// server.js
const express = require('express');
const dotenv = require('dotenv');
const proxyRoutes = require('./routes/proxy');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Static file handling (optional, if you serve custom assets)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', proxyRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
