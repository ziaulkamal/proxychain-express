// middlewares/subdomainParser.js
function subdomainParser(req, res, next) {
  const host = req.headers.host;

  if (!host) return next();

  const [sub, ...domainParts] = host.split('.');

  // Contoh: www-matamata-com → www.matamata.com
  const realDomain = sub.replace(/-/g, '.');

  req.realTargetDomain = `https://${realDomain}`;

  return next();
}

module.exports = subdomainParser;
