const { MongoClient } = require('mongodb');

// URL do MongoDB Atlas com formato mongodb+srv
const uri = 'mongodb+srv://silvaliramanoel086:7FOtJhJSCAbw09Pn@catalogoexpress.cp8lvzm.mongodb.net/catalogoexpress?retryWrites=true&w=majority';

exports.handler = async function(event, context) {
  try {
    // Conecta ao MongoDB Atlas
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      ssl: false,
      retryWrites: true,
      retryReads: true,
      maxPoolSize: 10,
      minPoolSize: 1,
      waitQueueTimeoutMS: 10000
    });

    // Conecta ao MongoDB
    await client.connect();
    console.log('Conectado ao MongoDB com sucesso');

    // Seleciona o banco de dados
    const db = client.db('catalogoexpress');
    
    // Insere alguns produtos de teste
    const products = [
      {
        name: "Produto Teste 1",
        description: "Descrição do produto teste 1",
        price: 19.99,
        category: "Teste",
        stock: 10
      },
      {
        name: "Produto Teste 2",
        description: "Descrição do produto teste 2",
        price: 29.99,
        category: "Teste",
        stock: 5
      }
    ];

    const result = await db.collection('products').insertMany(products);
    console.log('Produtos inseridos com sucesso:', result.insertedIds);

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
        message: 'Produtos inseridos com sucesso!',
        insertedIds: result.insertedIds
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
