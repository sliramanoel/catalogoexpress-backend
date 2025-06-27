const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Conecta ao MongoDB diretamente
const connection = mongoose.createConnection('mongodb+srv://silvaliramanoel086:7FOtJhJSCAbw09Pn@catalogoexpress.cp8lvzm.mongodb.net/?retryWrites=true&w=majority&appName=catalogoexpress', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Schema do Produto
const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true }
});

const Product = connection.model('Product', productSchema);

const app = express();
app.use(cors());
app.use(express.json());

// Rota para listar produtos
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// Função para o Netlify
exports.handler = async function(event, context) {
  return new Promise((resolve, reject) => {
    const server = require('http').createServer(app);
    
    server.on('request', (req, res) => {
      app(req, res, (err) => {
        if (err) {
          console.error('Erro na requisição:', err);
          reject(err);
        } else {
          resolve({
            statusCode: res.statusCode,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            },
            body: JSON.stringify(res._data)
          });
        }
        server.close();
      });
    });

    server.listen(0, () => {
      console.log('Servidor rodando');
    });
  });
};
