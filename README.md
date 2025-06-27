# CatalogoExpress Backend

Backend do aplicativo CatalogoExpress desenvolvido com Netlify Functions e MongoDB Atlas.

## Funcionalidades

- Adicionar produtos
- Listar produtos com paginação
- Buscar produto por ID
- Atualizar produto
- Deletar produto
- Listar categorias

## Endpoints

### Produtos

- **POST** `/add-product`
  - Adiciona um novo produto
  - Corpo da requisição:
    ```json
    {
      "name": "Nome do produto",
      "description": "Descrição do produto",
      "price": 99.99,
      "category": "Categoria",
      "stock": 10
    }
    ```

- **GET** `/get-products`
  - Lista produtos com paginação
  - Parâmetros de query:
    - `category`: Filtro por categoria (opcional)
    - `limit`: Número de itens por página (padrão: 10)
    - `page`: Número da página (padrão: 1)

- **GET** `/get-product?id=ID`
  - Busca um produto específico por ID

- **PUT** `/update-product?id=ID`
  - Atualiza um produto existente
  - Corpo da requisição:
    ```json
    {
      "name": "Novo nome",
      "description": "Nova descrição",
      "price": 89.99,
      "category": "Nova categoria",
      "stock": 15
    }
    ```

- **DELETE** `/delete-product?id=ID`
  - Remove um produto

### Categorias

- **GET** `/get-categories`
  - Lista todas as categorias únicas

## Configuração

### MongoDB Atlas

O projeto usa MongoDB Atlas como banco de dados. A string de conexão está configurada diretamente no código, mas em um ambiente de produção, é recomendado usar variáveis de ambiente.

### Netlify

O projeto está configurado para ser deployado no Netlify. O arquivo `netlify.toml` já está configurado com as configurações necessárias para o deploy.

## Estrutura do Projeto

```
netlify/
├── functions/                    # Funções Netlify
│   ├── add-product.js           # Adicionar produto
│   ├── get-products.js          # Listar produtos
│   ├── get-product.js           # Buscar produto
│   ├── update-product.js        # Atualizar produto
│   ├── delete-product.js        # Deletar produto
│   └── get-categories.js        # Listar categorias
└── netlify.toml                 # Configuração do Netlify
```

## Como Usar

1. Clone o repositório
2. Configure as variáveis de ambiente (recomendado)
3. Faça o deploy no Netlify
4. Acesse os endpoints através do URL do deploy

## Tecnologias

- Node.js
- MongoDB
- MongoDB Atlas
- Netlify Functions
- Express.js
