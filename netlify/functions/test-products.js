const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Dados de teste
const mockProducts = [
  {
    id: 1,
    title: 'Smartphone Galaxy S23',
    price: 4999.99,
    description: 'Smartphone Galaxy S23 com 256GB de armazenamento',
    category: 'Eletrônicos',
    image: 'https://via.placeholder.com/200x200?text=Smartphone'
  },
  {
    id: 2,
    title: 'Camiseta Polo',
    price: 99.99,
    description: 'Camiseta polo masculina branca',
    category: 'Roupas',
    image: 'https://via.placeholder.com/200x200?text=Camiseta'
  },
  {
    id: 3,
    title: 'Kit Snacks',
    price: 29.99,
    description: 'Kit com diversos snacks',
    category: 'Alimentos',
    image: 'https://via.placeholder.com/200x200?text=Snacks'
  }
];

// Rota para listar produtos
app.get('/products', (req, res) => {
  console.log('Recebendo requisição de produtos');
  res.json(mockProducts);
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
