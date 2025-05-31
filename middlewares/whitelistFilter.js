const { WHITELIST_DOMAINS } = require('../config/env');

// Middleware global, bisa digunakan untuk logging / skip proxy
function whitelistFilter(req, res, next) {
  const url = req.originalUrl;

  const isWhitelisted = WHITELIST_DOMAINS.some(domain => url.includes(domain));

  if (isWhitelisted) {
    return res.status(403).send('Access Denied: Whitelisted Domain');
  }

  next();
}

module.exports = whitelistFilter;
