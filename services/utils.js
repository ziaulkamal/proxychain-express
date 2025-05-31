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
  // Ex: www-matamata-com.ziadns.my.id
  if (!hostname.endsWith(mainHost)) return null;

  const subdomainPart = hostname.replace(`.${mainHost}`, '');

  if (!subdomainPart || subdomainPart === 'www') return null;

  // Reverse - to .
  const reversed = subdomainPart.replace(/-/g, '.');

  // Minimal valid domain check
  if (!reversed.includes('.')) return null;

  return `https://${reversed}`;
};