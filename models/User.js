const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false, // Não retorna a senha em queries por padrão
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  apiKey: {
    type: String,
    unique: true,
    sparse: true, // Permite valores nulos sem violar a unicidade
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware para fazer o hash da senha antes de salvar
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar senhas
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
