// middlewares/htmlRewriteMiddleware.js

const cheerio = require('cheerio');
const { subdomainFromDomain } = require('../services/urlService');
const fs = require('fs');
const path = require('path');

const HOST = process.env.HOST || 'ziadns.my.id';
const ROOT_TARGET = process.env.ROOT_TARGET || '';
const WHITELIST_PATH = path.resolve(__dirname, '../static/whitelist.txt');

let whitelistDomains = new Set();

function loadWhitelist() {
  try {
    const data = fs.readFileSync(WHITELIST_PATH, 'utf-8');
    whitelistDomains = new Set(
      data
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
    );
  } catch (err) {
    console.warn('[htmlRewriteMiddleware] Gagal load whitelist:', err.message);
  }
}
loadWhitelist();

/**
 * Fungsi utama rewrite HTML content
 * @param {string} html - konten HTML asli dari ROOT_TARGET
 * @returns {string} html yang sudah direwrite
 */
function rewriteHtmlContent(html) {
  const $ = cheerio.load(html);

  // Rewrite semua elemen <a> href
  $('a').each((_, el) => {
    let href = $(el).attr('href');
    if (!href) return;

    href = href.trim();

    // Jika href adalah link absolut (http/https)
    if (href.startsWith('http://') || href.startsWith('https://')) {
      const urlObj = new URL(href);
      const domain = urlObj.hostname;

      if (domain === new URL(ROOT_TARGET).hostname) {
        // Internal link ke ROOT_TARGET → ubah jadi domain kamu
        // Contoh: https://www.suara.com/abc → https://ziadns.my.id/abc
        const newPath = urlObj.pathname + urlObj.search + urlObj.hash;
        const newUrl = `https://${HOST}${newPath}`;
        $(el).attr('href', newUrl);
      } else if (whitelistDomains.has(domain)) {
        // Domain whitelist tidak diubah
      } else {
        // Domain eksternal non-whitelist → ubah jadi subdomain
        // Contoh: https://assets.suara.com → https://assets-suara-com.ziadns.my.id
        const subdomain = subdomainFromDomain(domain);
        const newUrl = `https://${subdomain}.${HOST}${urlObj.pathname}${urlObj.search}${urlObj.hash}`;
        $(el).attr('href', newUrl);
      }
    } else if (href.startsWith('/')) {
      // Link relatif → asumsi internal ROOT_TARGET → ubah ke domain kamu
      $(el).attr('href', `https://${HOST}${href}`);
    }
  });

  // Rewrite elemen <img>, <script>, <link> src/href untuk assets (jika perlu)
  $('[src]').each((_, el) => {
    let src = $(el).attr('src');
    if (!src) return;

    src = src.trim();
    if (src.startsWith('http://') || src.startsWith('https://')) {
      const urlObj = new URL(src);
      const domain = urlObj.hostname;

      if (domain === new URL(ROOT_TARGET).hostname) {
        // Internal asset → ubah jadi domain kamu
        const subdomain = subdomainFromDomain(domain);
        // Contoh assets.suara.com jadi assets-suara-com.ziadns.my.id
        const newUrl = `https://${subdomain}.${HOST}${urlObj.pathname}`;
        $(el).attr('src', newUrl);
      } else if (whitelistDomains.has(domain)) {
        // Do nothing
      } else {
        // Eksternal non whitelist, ubah jadi subdomain juga
        const subdomain = subdomainFromDomain(domain);
        const newUrl = `https://${subdomain}.${HOST}${urlObj.pathname}`;
        $(el).attr('src', newUrl);
      }
    } else if (src.startsWith('/')) {
      // Asset relatif → anggap dari ROOT_TARGET, ubah jadi domain kamu
      $(el).attr('src', `https://${HOST}${src}`);
    }
  });

  $('[href]').each((_, el) => {
    // Untuk <link> stylesheet dll
    let href = $(el).attr('href');
    if (!href) return;

    href = href.trim();
    if (href.startsWith('http://') || href.startsWith('https://')) {
      const urlObj = new URL(href);
      const domain = urlObj.hostname;

      if (domain === new URL(ROOT_TARGET).hostname) {
        const subdomain = subdomainFromDomain(domain);
        const newUrl = `https://${subdomain}.${HOST}${urlObj.pathname}`;
        $(el).attr('href', newUrl);
      } else if (whitelistDomains.has(domain)) {
        // Do nothing
      } else {
        const subdomain = subdomainFromDomain(domain);
        const newUrl = `https://${subdomain}.${HOST}${urlObj.pathname}`;
        $(el).attr('href', newUrl);
      }
    } else if (href.startsWith('/')) {
      $(el).attr('href', `https://${HOST}${href}`);
    }
  });

  return $.html();
}

module.exports = {
  rewriteHtmlContent,
};
