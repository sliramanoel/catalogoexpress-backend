const Address = require('../models/Address');

// @desc    Buscar o endereço do usuário logado
// @route   GET /api/address
// @access  Private
exports.getAddress = async (req, res) => {
  try {
    const address = await Address.findOne({ user: req.user._id });

    if (address) {
      res.json(address);
    } else {
      // Retorna um objeto vazio se não houver endereço, para o front-end lidar
      res.json({});
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar endereço', error: error.message });
  }
};

// @desc    Criar ou atualizar o endereço do usuário logado
// @route   POST /api/address
// @access  Private
exports.updateAddress = async (req, res) => {
  try {
    const { cep, street, number, complement, neighborhood, city, state } = req.body;

    let address = await Address.findOne({ user: req.user._id });

    if (address) {
      // Atualiza
      address.cep = cep || address.cep;
      address.street = street || address.street;
      address.number = number || address.number;
      address.complement = complement || address.complement;
      address.neighborhood = neighborhood || address.neighborhood;
      address.city = city || address.city;
      address.state = state || address.state;
    } else {
      // Cria
      address = new Address({
        user: req.user._id,
        cep, street, number, complement, neighborhood, city, state
      });
    }

    const updatedAddress = await address.save();
    res.json(updatedAddress);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar endereço', error: error.message });
  }
};
