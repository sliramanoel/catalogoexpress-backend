const { MongoClient } = require('mongodb');

// URL do MongoDB Atlas com formato mongodb+srv
const uri = 'mongodb+srv://silvaliramanoel086:7FOtJhJSCAbw09Pn@catalogoexpress.cp8lvzm.mongodb.net/catalogoexpress?retryWrites=true&w=majority';

exports.handler = async function(event, context) {
  try {
    // Conecta ao MongoDB Atlas
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
      connectTimeoutMS: 5000,
      retryWrites: true,
      retryReads: true
    });

    // Conecta ao MongoDB
    await client.connect();
    
    // Seleciona o banco de dados
    const db = client.db('catalogoexpress');
    
    // Busca todas as categorias únicas
    const categories = await db.collection('products').distinct('category');

    // Fecha a conexão
    await client.close();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        success: true,
        categories
      })
    };
  } catch (error) {
    console.error('Erro ao buscar categorias:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
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
