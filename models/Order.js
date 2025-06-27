const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  items: [
    {
      product: { type: Object, required: true }, // Armazena uma cópia do produto no momento do pedido
      quantity: { type: Number, required: true },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  address: {
    type: Object, // Armazena uma cópia do endereço de entrega
    required: true,
  },
  status: {
    type: String,
    enum: ['Pendente', 'Processando', 'Enviado', 'Entregue', 'Cancelado'],
    default: 'Pendente',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', OrderSchema);
