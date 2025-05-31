// config/env.js
require('dotenv').config();

module.exports = {
  HOST: process.env.HOST,
  ROOT_TARGET: process.env.ROOT_TARGET,
  WHITELIST_DOMAINS: (process.env.WHITELIST_DOMAINS || '').split(','),
  PORT: process.env.PORT || 3000
};
