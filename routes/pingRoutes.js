const express = require('express');
const router = express.Router();

// Endpoint para testar a conexão
router.get('/', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
