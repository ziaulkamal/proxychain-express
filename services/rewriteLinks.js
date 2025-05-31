// services/rewriteLinks.js
const cheerio = require('cheerio');
const { host, whitelist } = require('../config');
const { isWhitelisted, convertToProxyDomain } = require('./utils');

exports.rewriteHtml = (html, req, targetBase) => {
  const $ = cheerio.load(html);
  const rootDomain = new URL(targetBase).hostname;

  const convertUrl = (url) => {
    try {
      const parsedUrl = new URL(url, targetBase);
      const targetDomain = parsedUrl.hostname;

      if (isWhitelisted(targetDomain)) return url;

      // Internal link
      if (targetDomain === rootDomain) {
        return parsedUrl.pathname + parsedUrl.search;
      }

      // External → proxy subdomain
      const subdomain = convertToProxyDomain(targetDomain);
      return `${parsedUrl.protocol}//${subdomain}.${host}${parsedUrl.pathname}${parsedUrl.search}`;
    } catch {
      return url;
    }
  };

  $('a, img, script, link').each((_, el) => {
    const attr = el.tagName === 'a' ? 'href' : 'src';
    const url = $(el).attr(attr);
    if (url) {
      $(el).attr(attr, convertUrl(url));
    }
  });

  return $.html();
};
