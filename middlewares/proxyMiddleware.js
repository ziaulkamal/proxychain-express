const { createProxyMiddleware } = require('http-proxy-middleware');
const { subdomainToDomain } = require('../services/urlService');
const fs = require('fs');
const path = require('path');

const HOST = process.env.HOST;
const ROOT_TARGET = process.env.ROOT_TARGET;

const whitelistPath = path.join(__dirname, '..', 'static', 'whitelist.txt');
let whitelist = [];

try {
  const data = fs.readFileSync(whitelistPath, 'utf-8');
  whitelist = data.split('\n').map(d => d.trim()).filter(Boolean);
} catch (err) {
  console.error('Failed to load whitelist:', err);
}

function isWhitelisted(domain) {
  return whitelist.includes(domain);
}

const proxyMiddleware = createProxyMiddleware({
  changeOrigin: true,
  selfHandleResponse: false,
  router: function(req) {
    const host = req.headers.host || '';
    if (!host.endsWith(HOST)) return ROOT_TARGET;

    // subdomain.ziadns.my.id
    const subdomainPart = host.replace(`.${HOST}`, '');
    if (!subdomainPart || subdomainPart === HOST) return ROOT_TARGET;

    // Transform subdomain to domain asli
    const targetDomain = subdomainToDomain(subdomainPart);

    // Cek whitelist
    if (isWhitelisted(targetDomain)) {
      return `https://${targetDomain}`;
    }

    return `https://${targetDomain}`;
  },
  onProxyReq(proxyReq, req, res) {
    proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Node.js Proxy)');
  }
});

module.exports = proxyMiddleware;
