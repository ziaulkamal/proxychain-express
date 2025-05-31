// services/contentFetchService.js

const axios = require('axios');
const { rewriteHtmlContent } = require('../middlewares/htmlRewriteMiddleware');

const ROOT_TARGET = process.env.ROOT_TARGET || '';

/**
 * Fetch konten dari ROOT_TARGET + path dan rewrite HTML
 * @param {string} pathRequest - path + query string dari request
 * @returns {Promise<string>} HTML yang sudah direwrite
 */
async function fetchAndRewriteContent(pathRequest) {
  const targetUrl = ROOT_TARGET + pathRequest;

  try {
    const response = await axios.get(targetUrl, {
      responseType: 'text',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Node.js Proxy)', // Bisa diatur sesuai kebutuhan
        Accept: 'text/html,application/xhtml+xml,application/xml',
      },
    });

    const contentType = response.headers['content-type'] || '';
    if (!contentType.includes('text/html')) {
      // Jika bukan html, langsung return data mentah tanpa rewrite
      return response.data;
    }

    // Jika html, lakukan rewrite konten
    return rewriteHtmlContent(response.data);
  } catch (error) {
    console.error('[contentFetchService] Gagal fetch konten:', error.message);
    throw error;
  }
}

module.exports = {
  fetchAndRewriteContent,
};
