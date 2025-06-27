const { MongoClient } = require('mongodb');

// URL do MongoDB sem SSL
const uri = 'mongodb://silvaliramanoel086:7FOtJhJSCAbw09Pn@catalogoexpress-shard-00-00.cp8lvzm.mongodb.net:27017,catalogoexpress-shard-00-01.cp8lvzm.mongodb.net:27017,catalogoexpress-shard-00-02.cp8lvzm.mongodb.net:27017/?ssl=false&replicaSet=atlas-lfemt7-shard-0&authSource=admin&retryWrites=true&w=majority';

exports.handler = async function(event, context) {
  try {
    // Conecta ao MongoDB usando o driver nativo
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      ssl: false
    });

    // Conecta ao MongoDB
    await client.connect();

    // Seleciona o banco de dados
    const db = client.db();
    
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
