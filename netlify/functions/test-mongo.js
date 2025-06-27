const mongoose = require('mongoose');

// Conecta ao MongoDB diretamente
const connection = mongoose.createConnection('mongodb+srv://silvaliramanoel086:7FOtJhJSCAbw09Pn@catalogoexpress.cp8lvzm.mongodb.net/?retryWrites=true&w=majority&appName=catalogoexpress', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Schema do Produto
const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true }
});

const Product = connection.model('Product', productSchema);

exports.handler = async function(event, context) {
  try {
    // Testa a conexão com o MongoDB
    await connection.once('open');
    
    // Testa uma consulta simples
    const products = await Product.find({}).limit(1);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: JSON.stringify({
        success: true,
        message: 'Conexão com MongoDB funcionando!',
        products: products
      })
    };
  } catch (error) {
    console.error('Erro:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
