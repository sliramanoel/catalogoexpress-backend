const { MongoClient, ObjectId } = require('mongodb');

// URL do MongoDB Atlas com formato mongodb+srv
const uri = 'mongodb+srv://silvaliramanoel086:7FOtJhJSCAbw09Pn@catalogoexpress.cp8lvzm.mongodb.net/catalogoexpress?retryWrites=true&w=majority';

exports.handler = async function(event, context) {
  try {
    // Verifica se o ID foi fornecido
    const productId = event.queryStringParameters?.id;
    if (!productId) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
          success: false,
          error: 'ID do produto é obrigatório'
        })
      };
    }

    // Conecta ao MongoDB Atlas com configuração simplificada
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
    
    // Busca o produto
    const product = await db.collection('products').findOne({
      _id: new ObjectId(productId)
    });

    // Fecha a conexão
    await client.close();
    
    if (!product) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
          success: false,
          error: 'Produto não encontrado'
        })
      };
    }

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
        product
      })
    };
  } catch (error) {
    console.error('Erro ao buscar produto:', {
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
