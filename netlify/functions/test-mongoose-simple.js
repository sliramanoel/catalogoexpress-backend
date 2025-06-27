const mongoose = require('mongoose');

// URL do MongoDB com configurações SSL mais simples
const uri = 'mongodb+srv://silvaliramanoel086:7FOtJhJSCAbw09Pn@catalogoexpress.cp8lvzm.mongodb.net/?retryWrites=true&w=majority&appName=catalogoexpress&ssl=true&tlsAllowInvalidCertificates=true';

exports.handler = async function(event, context) {
  try {
    // Conecta ao MongoDB usando Mongoose com configurações SSL simples
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      ssl: true,
      sslValidate: false,
      tlsAllowInvalidCertificates: true
    });

    // Define o schema do produto
    const productSchema = new mongoose.Schema({
      name: String,
      price: Number,
      category: String
    });

    // Cria o modelo
    const Product = mongoose.model('Product', productSchema);

    // Busca um produto
    const products = await Product.find({}).limit(1);

    // Fecha a conexão
    await mongoose.connection.close();

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
        message: 'Conexão com MongoDB funcionando com Mongoose!',
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
