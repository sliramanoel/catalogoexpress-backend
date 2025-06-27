const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Configurações do servidor
const PORT = 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://silvaliramanoel086:7FOtJhJSCAbw09Pn@catalogoexpress.cp8lvzm.mongodb.net/?retryWrites=true&w=majority&appName=catalogoexpress';

// Conecta ao banco de dados
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB Conectado com sucesso!');
}).catch(err => {
  console.error('Erro ao conectar ao MongoDB:', err.message);
  process.exit(1);
});

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/address', require('./routes/addressRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/ping', require('./routes/pingRoutes'));

app.listen(PORT, () => {
  console.log(`Servidor rodando no modo ${process.env.NODE_ENV || 'development'} na porta ${PORT}`);
  console.log('Variáveis de ambiente carregadas:', {
    PORT,
    NODE_ENV: process.env.NODE_ENV,
    MONGO_URI: process.env.MONGO_URI ? 'MongoDB URI configurado' : 'MongoDB URI não configurado'
  });
});

// Adicionando tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Exportando o app para o Netlify
module.exports = app;
