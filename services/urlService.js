// services/urlService.js

/**
 * Mengubah subdomain dengan tanda "-" menjadi domain dengan titik "."
 * contoh: assets-suara-com -> assets.suara.com
 * @param {string} subdomain 
 * @returns {string} domain asli
 */
function subdomainToDomain(subdomain) {
  return subdomain.split('-').join('.');
}

/**
 * Mengubah domain dengan tanda "." menjadi subdomain dengan tanda "-"
 * contoh: assets.suara.com -> assets-suara-com
 * @param {string} domain 
 * @returns {string} subdomain yang sesuai
 */
function subdomainFromDomain(domain) {
  return domain.split('.').join('-');
}

module.exports = {
  subdomainToDomain,
  subdomainFromDomain,
};
