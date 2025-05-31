// services/utils.js
const { whitelist } = require('../config');

exports.isWhitelisted = (domain) => {
  return whitelist.includes(domain);
};

exports.convertToProxyDomain = (domain) => {
  return domain.replace(/\./g, '-');
};

exports.getTargetDomain = (req) => {
  const subdomain = req.headers.host.split('.')[0];
  return subdomain.replace(/-/g, '.');
};

exports.resolveTargetFromHost = (hostname, mainHost) => {
  // Jika sama dengan host utama → gunakan ROOT_TARGET
  if (hostname === mainHost || hostname === 'localhost') return null;

  // Ambil subdomain
  const subdomain = hostname.replace(`.${mainHost}`, '');

  // Reverse: www-matamata-com => www.matamata.com
  const reversed = subdomain.replace(/-/g, '.');

  // Validasi URL minimal
  if (!reversed.includes('.')) return null;

  return `https://${reversed}`;
};