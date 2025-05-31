const fs = require('fs');
const path = require('path');

const whitelistPath = path.join(__dirname, '../static/whitelist.txt');
let whitelist = [];

function loadWhitelist() {
  try {
    const data = fs.readFileSync(whitelistPath, 'utf-8');
    whitelist = data
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);
  } catch (error) {
    console.error('Gagal membaca whitelist.txt:', error.message);
    whitelist = [];
  }
}

// Langsung load saat module diimport
loadWhitelist();

function isWhitelisted(url) {
  return whitelist.some(domain => url.includes(domain));
}

module.exports = {
  isWhitelisted,
  reloadWhitelist: loadWhitelist, // opsional: untuk refresh manual
};
