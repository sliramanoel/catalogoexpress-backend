const { MongoClient } = require('mongodb');

// URL do MongoDB com configurações SSL mais simples
const uri = 'mongodb+srv://silvaliramanoel086:7FOtJhJSCAbw09Pn@catalogoexpress.cp8lvzm.mongodb.net/?retryWrites=true&w=majority&appName=catalogoexpress&ssl=true&tlsAllowInvalidCertificates=true';

exports.handler = async function(event, context) {
  try {
    // Conecta ao MongoDB usando o driver nativo com configurações SSL simples
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      ssl: true,
      sslValidate: false,
      tlsAllowInvalidCertificates: true
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
