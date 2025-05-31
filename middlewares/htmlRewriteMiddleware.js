const cheerio = require('cheerio');
const { subdomainFromDomain } = require('../services/urlService');
const fs = require('fs');
const path = require('path');

const HOST = process.env.HOST;
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

function rewriteHtmlContent(html) {
  const $ = cheerio.load(html);

  $('a, link, script, img').each((_, el) => {
    const attr = el.tagName === 'a' || el.tagName === 'link' ? 'href' : 'src';
    const url = $(el).attr(attr);
    if (!url) return;

    // Ubah link artikel ROOT_TARGET ke HOST
    if (url.startsWith(process.env.ROOT_TARGET)) {
      const newUrl = url.replace(process.env.ROOT_TARGET, `https://${HOST}`);
      $(el).attr(attr, newUrl);
      return;
    }

    try {
      const u = new URL(url, process.env.ROOT_TARGET);
      const domain = u.hostname;

      if (domain === new URL(process.env.ROOT_TARGET).hostname) {
        // ubah ke subdomain
        const subdomain = subdomainFromDomain(domain);
        u.hostname = `${subdomain}.${HOST}`;
        $(el).attr(attr, u.toString());
      } else {
        if (!isWhitelisted(domain)) {
          const subdomain = subdomainFromDomain(domain);
          u.hostname = `${subdomain}.${HOST}`;
          $(el).attr(attr, u.toString());
        }
      }
    } catch {
      // skip invalid URL
    }
  });

  return $.html();
}

module.exports = {
  rewriteHtmlContent,
  isWhitelisted
};
