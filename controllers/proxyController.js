// controllers/proxyController.js
exports.handleRequest = async (req, res) => {
  try {
    const hostname = req.hostname;
    const customTarget = resolveTargetFromHost(hostname, host);
    const targetBase = customTarget || rootTarget;

    const targetUrl = `${targetBase}${req.originalUrl}`;

    console.log('⤴️ Hostname:', hostname);
    console.log('🎯 Target base:', targetBase);
    console.log('🔗 Target URL:', targetUrl);

    const originalHtml = await fetchAndParse(targetUrl);
    const modifiedHtml = rewriteHtml(originalHtml, req, targetBase);

    res.send(modifiedHtml);
  } catch (err) {
    console.error('❌ Proxy Error:', err.message);
    res.status(500).send('Internal Server Error');
  }
};
