const express = require('express');
const router = express.Router();
const {
  createUser,
  getUsers,
  deleteUser,
  generateApiKey,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Rota para o usuário logado gerar sua própria API Key
router.route('/me/apikey').post(protect, generateApiKey);

// Rotas abaixo são apenas para administradores
router.route('/').get(protect, admin, getUsers).post(protect, admin, createUser);
router.route('/:id').delete(protect, admin, deleteUser);

module.exports = router;
