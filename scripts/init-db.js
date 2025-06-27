const mongoose = require('mongoose');

// Conecta ao MongoDB
mongoose.connect('mongodb+srv://silvaliramanoel086:7FOtJhJSCAbw09Pn@catalogoexpress.cp8lvzm.mongodb.net/?retryWrites=true&w=majority&appName=catalogoexpress', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Schema do Produto
const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true }
});

const Product = mongoose.model('Product', productSchema);

// Schema da Categoria
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String }
});

const Category = mongoose.model('Category', categorySchema);

// Dados de teste
const categories = [
  { name: 'Eletrônicos', description: 'Produtos eletrônicos e tecnologia' },
  { name: 'Roupas', description: 'Roupas e acessórios' },
  { name: 'Alimentos', description: 'Produtos alimentícios' }
];

const products = [
  {
    title: 'Smartphone Galaxy S23',
    price: 4999.99,
    description: 'Smartphone Galaxy S23 com 256GB de armazenamento',
    category: 'Eletrônicos',
    image: 'https://via.placeholder.com/200x200?text=Smartphone'
  },
  {
    title: 'Camiseta Polo',
    price: 99.99,
    description: 'Camiseta polo masculina branca',
    category: 'Roupas',
    image: 'https://via.placeholder.com/200x200?text=Camiseta'
  },
  {
    title: 'Kit Snacks',
    price: 29.99,
    description: 'Kit com diversos snacks',
    category: 'Alimentos',
    image: 'https://via.placeholder.com/200x200?text=Snacks'
  }
];

// Função para inicializar o banco de dados
async function initDatabase() {
  try {
    // Limpa as coleções existentes
    await Product.deleteMany({});
    await Category.deleteMany({});

    // Insere categorias
    await Category.insertMany(categories);
    console.log('Categorias inseridas com sucesso!');

    // Insere produtos
    await Product.insertMany(products);
    console.log('Produtos inseridos com sucesso!');

    console.log('Inicialização do banco de dados concluída!');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
    process.exit(1);
  }
}

// Executa a inicialização
initDatabase();
