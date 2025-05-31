// services/urlTransformer.js
const { HOST } = require('../config/env');
const { isWhitelisted } = require('./whitelist');

function toProxySubdomain(url) {
  const domain = new URL(url).hostname;
  const transformed = domain.replace(/\./g, '-');
  return url.replace(domain, `${transformed}.${HOST}`);
}

function toLocalPath(url, rootTarget) {
  const targetHost = new URL(rootTarget).hostname;
  return url.replace(new RegExp(`https?://${targetHost}`), '');
}

function transformUrl(url, rootTarget) {
  try {
    if (!url.startsWith('http')) return url;

    if (isWhitelisted(url)) return url;

    const isInternal = url.startsWith(rootTarget);
    return isInternal
      ? toLocalPath(url, rootTarget)
      : toProxySubdomain(url);
  } catch (e) {
    return url;
  }
}

module.exports = {
  transformUrl,
};
