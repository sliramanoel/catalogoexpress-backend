#!/bin/bash

# Configuração do MongoDB Atlas
MONGO_URI="mongodb+srv://silvaliramanoel086:7FOtJhJSCAbw09Pn@catalogoexpress.cp8lvzm.mongodb.net/?retryWrites=true&w=majority&appName=catalogoexpress"

# Configura variáveis de ambiente no Netlify
/home/max/.nvm/versions/node/v20.10.0/bin/netlify env:set MONGO_URI "$MONGO_URI"
/home/max/.nvm/versions/node/v20.10.0/bin/netlify env:set JWT_SECRET "catalogoexpress_jwt_secret_2025"

# Deploy
/home/max/.nvm/versions/node/v20.10.0/bin/netlify deploy --prod
