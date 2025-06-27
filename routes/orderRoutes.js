const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Rotas de Usuário
router.route('/').post(protect, createOrder);
router.route('/myorders').get(protect, getMyOrders);

// Rotas de Admin
router.route('/').get(protect, admin, getOrders);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;
