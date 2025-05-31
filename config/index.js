// config/index.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const whitelistFile = path.join(__dirname, '../static/whitelist.txt');

let whitelist = [];

try {
  const data = fs.readFileSync(whitelistFile, 'utf-8');
  whitelist = data
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.startsWith('#'));
} catch (err) {
  console.error('⚠️  Gagal membaca whitelist.txt:', err.message);
}

module.exports = {
  host: process.env.HOST,
  rootTarget: process.env.ROOT_TARGET,
  whitelist,
};
