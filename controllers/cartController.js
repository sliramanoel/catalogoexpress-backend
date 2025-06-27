const Cart = require('../models/Cart');

// @desc    Buscar o carrinho do usuário logado
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    // Popula os dados do produto no carrinho
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product',
      'name price image'
    );

    if (cart) {
      res.json(cart);
    } else {
      // Se não houver carrinho, cria um vazio
      const newCart = await Cart.create({ user: req.user._id, items: [] });
      res.json(newCart);
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar carrinho', error: error.message });
  }
};

// @desc    Atualizar o carrinho do usuário logado
// @route   POST /api/cart
// @access  Private
exports.updateCart = async (req, res) => {
  try {
    const { items } = req.body; // Espera um array de { product: 'id', quantity: X }

    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      cart.items = items;
    } else {
      cart = new Cart({ user: req.user._id, items });
    }

    const updatedCart = await cart.save();
    const populatedCart = await updatedCart.populate('items.product', 'name price image');

    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar carrinho', error: error.message });
  }
};
