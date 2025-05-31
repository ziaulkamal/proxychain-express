const express = require('express');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');

// Load .env (jika ada)
dotenv.config();

const proxyRoute = require('./routes/proxy');
const subdomainParser = require('./middlewares/subdomainParser');

const app = express();
const PORT = process.env.PORT || 3000;

// Log HTTP request
app.use(morgan('dev'));

// Gunakan middleware untuk parsing subdomain (opsional)
app.use(subdomainParser);

// Serve file statis (kalau ada)
app.use('/static', express.static(path.join(__dirname, 'static')));

// Route utama proxy
app.use('/', proxyRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Internal Server Error');
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
