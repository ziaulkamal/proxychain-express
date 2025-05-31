const express = require('express');
const router = express.Router();

const fetchPage = require('../services/fetchPage');
const contentParser = require('../services/contentParser');
const { ROOT_TARGET, HOST } = require('../config/env');

router.get('*', async (req, res) => {
  try {
    const originalPath = req.originalUrl;
    const targetUrl = `${ROOT_TARGET}${originalPath}`;

    // Ambil konten dari ROOT_TARGET
    const response = await fetchPage(targetUrl);

    // Cek konten-type
    const contentType = response.headers['content-type'] || '';

    // Kalau bukan HTML (misal CSS, JS, IMG), proxy-kan langsung
    if (!contentType.includes('text/html')) {
      res.set(response.headers);
      return res.status(response.status).send(response.body);
    }

    // Kalau HTML, parsing & ubah link2 di dalamnya
    const parsedHtml = contentParser(response.body, {
      rootTarget: ROOT_TARGET,
      hostDomain: HOST,
    });

    res.set('Content-Type', 'text/html');
    return res.send(parsedHtml);
  } catch (err) {
    console.error('Proxy error:', err.message);
    return res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
