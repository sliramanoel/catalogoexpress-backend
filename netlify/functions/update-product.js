const { MongoClient, ObjectId } = require('mongodb');

// URL do MongoDB Atlas com formato mongodb+srv
const uri = 'mongodb+srv://silvaliramanoel086:7FOtJhJSCAbw09Pn@catalogoexpress.cp8lvzm.mongodb.net/catalogoexpress?retryWrites=true&w=majority';

exports.handler = async function(event, context) {
  try {
    // Verifica se o corpo da requisição existe
    if (!event.body) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'PUT,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
          success: false,
          error: 'Corpo da requisição é obrigatório'
        })
      };
    }

    // Parse do corpo da requisição
    const update = JSON.parse(event.body);
    
    // Verifica se o ID foi fornecido
    const productId = event.queryStringParameters?.id;
    if (!productId) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'PUT,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
          success: false,
          error: 'ID do produto é obrigatório'
        })
      };
    }

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
    
    // Atualiza o produto
    const result = await db.collection('products').updateOne(
      { _id: new ObjectId(productId) },
      { $set: update }
    );

    // Fecha a conexão
    await client.close();
    
    if (result.matchedCount === 0) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'PUT,OPTIONS',
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
        'Access-Control-Allow-Methods': 'PUT,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        success: true,
        message: 'Produto atualizado com sucesso',
        updatedFields: update
      })
    };
  } catch (error) {
    console.error('Erro ao atualizar produto:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PUT,OPTIONS',
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
