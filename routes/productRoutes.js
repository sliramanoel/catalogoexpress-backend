const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getMyProducts,
} = require('../controllers/productController');
const { flexibleAuth } = require('../middleware/authMiddleware');

// Rotas públicas
router.route('/').get(getProducts);
router.route('/myproducts').get(flexibleAuth, getMyProducts);

// Rotas de gerenciamento de produtos (requer autenticação flexível)
router.route('/').post(flexibleAuth, createProduct);
router.route('/:id').put(flexibleAuth, updateProduct);
router.route('/:id').delete(flexibleAuth, deleteProduct);

module.exports = router;
