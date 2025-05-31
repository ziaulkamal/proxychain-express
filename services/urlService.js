function subdomainToDomain(subdomain) {
  return subdomain.split('-').join('.');
}

function subdomainFromDomain(domain) {
  return domain.split('.').join('-');
}

module.exports = {
  subdomainToDomain,
  subdomainFromDomain
};
