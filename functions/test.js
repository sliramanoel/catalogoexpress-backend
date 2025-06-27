const express = require('express');
const serverless = require('serverless-http');

const app = express();

const router = express.Router();
router.get('/ping', (req, res) => {
  res.status(200).send('Pong from test function!');
});

app.use('/', router); // Monta o router na raiz

module.exports.handler = serverless(app);
