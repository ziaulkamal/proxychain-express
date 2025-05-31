const express = require('express');
const router = express.Router();
const proxyMiddleware = require('../middlewares/proxyMiddleware');
const { fetchAndRewriteContent } = require('../services/contentFetchService');

const HOST = process.env.HOST;

router.use(proxyMiddleware);

router.use(async (req, res, next) => {
  if ((req.headers.host || '') !== HOST) return next();

  try {
    const fullPath = req.originalUrl || req.url;
    const content = await fetchAndRewriteContent(fullPath);
    res.send(content);
  } catch (e) {
    res.status(502).send('Bad Gateway');
  }
});

module.exports = router;
