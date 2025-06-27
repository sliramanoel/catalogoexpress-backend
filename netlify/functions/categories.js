const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Conecta ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Schema da Categoria
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String }
});

const Category = mongoose.model('Category', categorySchema);

const app = express();
app.use(cors());
app.use(express.json());

// Rota para listar todas as categorias
app.get('/', async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para buscar categoria por ID
app.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Função para o Netlify
exports.handler = async function(event, context) {
  return new Promise((resolve, reject) => {
    const server = require('http').createServer(app);
    
    server.on('request', (req, res) => {
      app(req, res, (err) => {
        if (err) {
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
