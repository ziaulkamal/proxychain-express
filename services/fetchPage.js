const axios = require('axios');

async function fetchPage(url) {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer', // supaya bisa handle binary (img, etc)
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ProxyBot/1.0)',
      }
    });

    return {
      status: response.status,
      headers: response.headers,
      body: response.data.toString('utf8') // convert ke string HTML
    };
  } catch (error) {
    console.error(`Gagal fetch: ${url}`);
    throw error;
  }
}

module.exports = fetchPage;
