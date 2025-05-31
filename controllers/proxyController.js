// controllers/proxyController.js
const { fetchAndParse } = require('../services/fetchContent');
const { rewriteHtml } = require('../services/rewriteLinks');
const { rootTarget, host } = require('../config');
const { resolveTargetFromHost } = require('../services/utils');

exports.handleRequest = async (req, res) => {
  try {
    const hostname = req.hostname;
    const customTarget = resolveTargetFromHost(hostname, host);
    const targetBase = customTarget || rootTarget;

    const targetUrl = `${targetBase}${req.originalUrl}`;
    const originalHtml = await fetchAndParse(targetUrl);
    const modifiedHtml = rewriteHtml(originalHtml, req, targetBase);

    res.send(modifiedHtml);
  } catch (err) {
    console.error('Proxy Error:', err.message);
    res.status(500).send('Internal Server Error');
  }
};
