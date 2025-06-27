const User = require('../models/User');
const crypto = require('crypto');

// @desc    Criar um novo usuário (Admin)
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role, // Admin pode definir o papel
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};

// @desc    Listar todos os usuários (Admin)
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message });
  }
};

// @desc    Deletar um usuário (Admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
// @desc    Gerar/Resetar a API Key do usuário
// @route   POST /api/users/me/apikey
// @access  Private
exports.generateApiKey = async (req, res) => {
  try {
    // Gera uma chave de 32 bytes e converte para hexadecimal
    const apiKey = crypto.randomBytes(32).toString('hex');

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    user.apiKey = apiKey;
    await user.save();

    res.json({ apiKey });

  } catch (error) {
    res.status(500).json({ message: 'Erro ao gerar a chave de API', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // Evitar que um admin se auto-delete
      if (req.user._id.equals(user._id)) {
          return res.status(400).json({ message: 'Administradores não podem se auto-excluir.' });
      }
      await user.deleteOne();
      res.json({ message: 'Usuário removido' });
    } else {
      res.status(404).json({ message: 'Usuário não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar usuário', error: error.message });
  }
};
