// routes/proxy.js

const express = require('express');
const router = express.Router();
const dynamicSubdomainProxy = require('../middlewares/proxyMiddleware');
const { HOST } = process.env;
const { fetchAndRewriteContent } = require('../services/contentFetchService');

router.use(dynamicSubdomainProxy);

// Middleware utama untuk proxy ROOT_TARGET dan rewrite konten
router.use(async (req, res, next) => {
  const host = req.headers.host || '';

  if (host !== HOST) {
    // Kalau bukan domain utama, lewati
    return next();
  }

  try {
    // Gabungkan path + query string
    const fullPath = req.originalUrl || req.url;

    // Fetch dan rewrite konten dari ROOT_TARGET
    const rewrittenHtml = await fetchAndRewriteContent(fullPath);

    // Kirim hasil ke client
    res.send(rewrittenHtml);
  } catch (error) {
    console.error('[proxy.js] Error fetching content:', error.message);
    res.status(502).send('Bad Gateway');
  }
});

module.exports = router;
