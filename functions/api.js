const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const serverless = require('serverless-http'); // Adaptador para Netlify

// URI do MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://silvaliramanoel086:7FOtJhJSCAbw09Pn@catalogoexpress.cp8lvzm.mongodb.net/?retryWrites=true&w=majority&appName=catalogoexpress';

// Conecta ao banco de dados (TEMPORARIAMENTE DESATIVADO PARA TESTE)
/*
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB Conectado com sucesso!');
}).catch(err => {
  console.error('Erro ao conectar ao MongoDB:', err.message);
});
*/

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas (sem o prefixo /api, pois o Netlify já o gerencia)
app.use('/auth', require('../routes/authRoutes'));
app.use('/products', require('../routes/productRoutes'));
app.use('/categories', require('../routes/categoryRoutes'));
app.use('/address', require('../routes/addressRoutes'));
app.use('/cart', require('../routes/cartRoutes'));
app.use('/orders', require('../routes/orderRoutes'));
app.use('/users', require('../routes/userRoutes'));
app.use('/ping', require('../routes/pingRoutes'));

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Exporta o handler compatível com Netlify
module.exports.handler = serverless(app);
