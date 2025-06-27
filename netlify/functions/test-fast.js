const { MongoClient } = require('mongodb');

// URL do MongoDB Atlas
const uri = 'mongodb://silvaliramanoel086:7FOtJhJSCAbw09Pn@catalogoexpress-shard-00-00.cp8lvzm.mongodb.net:27017,catalogoexpress-shard-00-01.cp8lvzm.mongodb.net:27017,catalogoexpress-shard-00-02.cp8lvzm.mongodb.net:27017/catalogoexpress?ssl=false&replicaSet=atlas-123456-shard-0&authSource=admin&retryWrites=true&w=majority';

exports.handler = async function(event, context) {
  try {
    // Configurações de timeout mais rápidas
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 segundos
      socketTimeoutMS: 5000, // 5 segundos
      connectTimeoutMS: 5000, // 5 segundos
      ssl: false,
      retryWrites: true,
      retryReads: true,
      maxPoolSize: 10,
      minPoolSize: 1,
      waitQueueTimeoutMS: 5000
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
        message: 'Conexão rápida com MongoDB Atlas funcionando!',
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
