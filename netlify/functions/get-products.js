const { MongoClient } = require('mongodb');

// URL do MongoDB Atlas com formato mongodb+srv
const uri = 'mongodb+srv://silvaliramanoel086:7FOtJhJSCAbw09Pn@catalogoexpress.cp8lvzm.mongodb.net/catalogoexpress?retryWrites=true&w=majority';

exports.handler = async function(event, context) {
  try {
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
    
    // Obtém os parâmetros da query
    const { category, limit = 10, page = 1 } = event.queryStringParameters || {};
    const skip = (page - 1) * limit;

    // Constrói o filtro
    const filter = category ? { category: category } : {};

    // Busca os produtos
    const products = await db.collection('products')
      .find(filter)
      .skip(skip)
      .limit(limit)
      .toArray();

    // Busca o total de produtos para paginação
    const total = await db.collection('products').countDocuments(filter);

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
        products: products,
        total,
        page: parseInt(page),
        limit: parseInt(limit)
      })
    };
  } catch (error) {
    console.error('Erro ao buscar produtos:', {
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
