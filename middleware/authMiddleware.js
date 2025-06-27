const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Pega o token do header (Bearer TOKEN)
      token = req.headers.authorization.split(' ')[1];

      // Verifica o token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Pega o usuário do token e anexa à requisição (sem a senha)
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Não autorizado, token falhou' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Não autorizado, sem token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Acesso negado, rota para administradores' });
  }
};

const apiKeyAuth = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    // Se não houver chave de API, simplesmente passa para o próximo middleware.
    // A decisão de bloquear ou não ficará a cargo do próximo na cadeia (ex: protect).
    return next(); 
  }

  try {
    const user = await User.findOne({ apiKey }).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Não autorizado, chave de API inválida' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor durante a autenticação da chave de API' });
  }
};

// Middleware combinado: tenta JWT, depois API Key.
const flexibleAuth = async (req, res, next) => {
  // Tenta primeiro a autenticação por JWT (Bearer token)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  // Se não houver token JWT, tenta a autenticação por API Key
  if (req.headers['x-api-key']) {
    return apiKeyAuth(req, res, (err) => {
      // Se apiKeyAuth retornar erro, repassa o erro.
      if (err) return next(err);
      // Se apiKeyAuth autenticar com sucesso (req.user existe), continua.
      if (req.user) return next();
      // Se apiKeyAuth não autenticar e não der erro (chave não encontrada), nega o acesso.
      return res.status(401).json({ message: 'Não autorizado' });
    });
  }

  // Se não houver nenhum método de autenticação, nega o acesso.
  res.status(401).json({ message: 'Não autorizado, token ou chave de API não fornecidos' });
};


module.exports = { protect, admin, apiKeyAuth, flexibleAuth };
