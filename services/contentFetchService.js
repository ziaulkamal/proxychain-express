const axios = require('axios');
const { rewriteHtmlContent } = require('../middlewares/htmlRewriteMiddleware');

const ROOT_TARGET = process.env.ROOT_TARGET;

async function fetchAndRewriteContent(pathRequest) {
  const targetUrl = ROOT_TARGET + pathRequest;
  const res = await axios.get(targetUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Node.js Proxy)' } });
  if (!res.headers['content-type'] || !res.headers['content-type'].includes('text/html')) {
    return res.data;
  }
  return rewriteHtmlContent(res.data);
}

module.exports = {
  fetchAndRewriteContent
};
