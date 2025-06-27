const { MongoClient } = require('mongodb');

// URL do MongoDB Atlas
const uri = 'mongodb+srv://silvaliramanoel086:7FOtJhJSCAbw09Pn@catalogoexpress.cp8lvzm.mongodb.net/catalogoexpress?retryWrites=true&w=majority';

exports.handler = async function(event, context) {
  try {
    // Conecta ao MongoDB Atlas
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000
    });

    // Conecta ao MongoDB
    await client.connect();

    // Seleciona o banco de dados
    const db = client.db('catalogoexpress');
    
    // Testa uma consulta simples
    const products = await db.collection('products').find({}).limit(1).toArray();
    
    // Fecha a conexão
    await client.close();
    
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
        message: 'Conexão final com MongoDB Atlas funcionando!',
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
