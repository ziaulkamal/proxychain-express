const express = require('express');
const app = express();
const { PORT } = require('./config/env');

const proxyRouter = require('./routes/proxy');

app.use('/', proxyRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
