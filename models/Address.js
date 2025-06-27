const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  cep: String,
  street: String,
  number: String,
  complement: String,
  neighborhood: String,
  city: String,
  state: String,
});

module.exports = mongoose.model('Address', AddressSchema);
