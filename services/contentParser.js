const cheerio = require('cheerio');
const { transformUrl } = require('./urlTransformer');

function contentParser(html, { rootTarget, hostDomain }) {
  const $ = cheerio.load(html);

  const attrs = [
    { tag: 'a', attr: 'href' },
    { tag: 'img', attr: 'src' },
    { tag: 'script', attr: 'src' },
    { tag: 'link', attr: 'href' },
    { tag: 'source', attr: 'src' },
    { tag: 'iframe', attr: 'src' },
  ];

  attrs.forEach(({ tag, attr }) => {
    $(tag).each((_, el) => {
      const original = $(el).attr(attr);
      if (original) {
        const transformed = transformUrl(original, rootTarget);
        $(el).attr(attr, transformed);
      }
    });
  });

  // Optional: replace canonical/meta if mau SEO friendly custom
  $('link[rel="canonical"]').attr('href', `https://${hostDomain}${$.root().find('link[rel="canonical"]').attr('href') || ''}`);

  return $.html();
}

module.exports = contentParser;
