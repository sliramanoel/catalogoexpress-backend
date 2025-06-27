const { MongoClient } = require('mongodb');

// URL do MongoDB Atlas com formato mongodb+srv
const uri = 'mongodb+srv://silvaliramanoel086:7FOtJhJSCAbw09Pn@catalogoexpress.cp8lvzm.mongodb.net/catalogoexpress?retryWrites=true&w=majority';

exports.handler = async function(event, context) {
  try {
    // Conecta ao MongoDB Atlas com configurações DNS
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      ssl: true,
      retryWrites: true,
      retryReads: true,
      maxPoolSize: 10,
      minPoolSize: 1,
      waitQueueTimeoutMS: 10000,
      // Configurações DNS
      dnsServerTimeoutMS: 5000,
      dnsCacheTtl: 300,
      dnsCacheSize: 1000
    });

    // Conecta ao MongoDB
    await client.connect();
    console.log('Conectado ao MongoDB com sucesso');

    // Seleciona o banco de dados
    const db = client.db('catalogoexpress');
    
    // Testa uma consulta simples
    const products = await db.collection('products').find({}).limit(1).toArray();
    console.log('Consulta realizada com sucesso');

    // Fecha a conexão
    await client.close();
    console.log('Conexão fechada com sucesso');
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: 'Conexão final com DNS resolvido funcionando!',
        products: products
      })
    };
  } catch (error) {
    console.error('Erro na conexão:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: {
          message: error.message,
          name: error.name,
          stack: error.stack
        }
      })
    };
  }
};
