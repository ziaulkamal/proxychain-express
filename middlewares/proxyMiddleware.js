// middlewares/proxyMiddleware.js

const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');
const path = require('path');
const { subdomainToDomain } = require('../services/urlService');

const HOST = process.env.HOST || 'ziadns.my.id';
const WHITELIST_PATH = path.resolve(__dirname, '../static/whitelist.txt');

let whitelistDomains = new Set();

// Fungsi untuk load whitelist dari file
function loadWhitelist() {
  try {
    const data = fs.readFileSync(WHITELIST_PATH, 'utf-8');
    whitelistDomains = new Set(
      data
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
    );
    console.log('[proxyMiddleware] Whitelist domains loaded:', whitelistDomains);
  } catch (err) {
    console.warn('[proxyMiddleware] Gagal load whitelist:', err.message);
  }
}

// Load whitelist saat server start
loadWhitelist();

function dynamicSubdomainProxy(req, res, next) {
  const host = req.headers.host || '';

  if (!host.endsWith(HOST)) return next();

  const subdomainPart = host.replace(`.${HOST}`, '');

  // Kalau subdomain tidak ada tanda "-", artinya bukan subdomain proxy pattern
  if (!subdomainPart.includes('-')) return next();

  // Konversi subdomain "assets-suara-com" => "assets.suara.com"
  const targetDomain = subdomainToDomain(subdomainPart);

  // Cek whitelist, kalau domain ada di whitelist jangan proxy
  if (whitelistDomains.has(targetDomain)) {
    return next();
  }

  // Buat proxy middleware untuk domain target
  const proxy = createProxyMiddleware({
    target: `https://${targetDomain}`,
    changeOrigin: true,
    secure: true,
    headers: {
      host: targetDomain,
    },
    logLevel: 'warn',
    onProxyReq(proxyReq, req, res) {
      // Optional: kamu bisa modifikasi header di sini jika perlu
    },
    onError(err, req, res) {
      console.error('[proxyMiddleware] Proxy error:', err.message);
      res.status(502).send('Bad Gateway');
    }
  });

  return proxy(req, res, next);
}

module.exports = dynamicSubdomainProxy;
