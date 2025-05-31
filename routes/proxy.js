// routes/proxy.js
const express = require('express');
const router = express.Router();
const proxyController = require('../controllers/proxyController');

// Tangkap semua route
router.get('*', proxyController.handleRequest);

module.exports = router;
