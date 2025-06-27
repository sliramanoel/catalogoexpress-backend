const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://silvaliramanoel086:7FOtJhJSCAbw09Pn@catalogoexpress.cp8lvzm.mongodb.net/?retryWrites=true&w=majority&appName=catalogoexpress';

// Função para aguardar um tempo específico
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

exports.handler = async function(event, context) {
  try {
    // Conecta ao MongoDB usando o driver nativo
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 segundos de timeout
      socketTimeoutMS: 45000, // 45 segundos de timeout para socket
      connectTimeoutMS: 30000 // 30 segundos de timeout para conexão
    });

    // Aguarda 2 segundos para garantir que a conexão tenha tempo de ser estabelecida
    await wait(2000);

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
