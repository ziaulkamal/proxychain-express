require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./routes/proxy');

const PORT = process.env.PORT || 3000;

app.use(routes);

app.use((req, res) => res.status(404).send('Not Found'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
