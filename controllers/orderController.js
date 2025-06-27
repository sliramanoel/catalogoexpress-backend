const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Address = require('../models/Address');

// @desc    Criar um novo pedido
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const user = req.user._id;

    // 1. Buscar carrinho e endereço
    const cart = await Cart.findOne({ user }).populate('items.product');
    const address = await Address.findOne({ user });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Seu carrinho está vazio' });
    }

    if (!address) {
      return res.status(400).json({ message: 'Endereço de entrega não encontrado' });
    }

    // 2. Calcular o total e preparar os itens do pedido
    let total = 0;
    const orderItems = cart.items.map(item => {
      const product = item.product;
      total += product.price * item.quantity;
      return {
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
        },
        quantity: item.quantity,
      };
    });

    // 3. Criar o pedido
    const order = new Order({
      user,
      items: orderItems,
      total,
      address: address.toObject(), // Salva uma cópia do endereço
    });

    const createdOrder = await order.save();

    // 4. Limpar o carrinho do usuário
    cart.items = [];
    await cart.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar pedido', error: error.message });
  }
};

// @desc    Buscar os pedidos do usuário logado
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pedidos', error: error.message });
  }
};

// @desc    Listar todos os pedidos (Admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar todos os pedidos', error: error.message });
  }
};

// @desc    Atualizar status do pedido (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = req.body.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Pedido não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar status do pedido', error: error.message });
  }
};
