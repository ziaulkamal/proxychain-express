// services/fetchContent.js
const axios = require('axios');

exports.fetchAndParse = async (url) => {
  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; SEO-Proxy/1.0)',
    },
  });

  return response.data;
};
