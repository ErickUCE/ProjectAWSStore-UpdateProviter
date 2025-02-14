const fs = require('fs');
const path = require('path');
const { ApolloServer } = require('apollo-server');
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const resolvers = require('./graphql/resolvers');
const router = require('./routes/providerRoutes');
const cors = require('cors'); // ✅ Importar CORS

// Leer el esquema GraphQL
const typeDefs = fs.readFileSync(path.join(__dirname, 'graphql/schema.graphql'), 'utf-8');

// Configurar Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Configurar Express
const app = express();
app.use(cors({
    origin: "*",  // Permite todas las conexiones. ⚠️ Cambia esto si solo permites desde tu frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(bodyParser.json());
app.use(router);

// Iniciar ambos servidores
sequelize.sync().then(() => {
    server.listen({ port: 4002 }).then(({ url }) => {
        console.log(`🚀 GraphQL xds server ready at ${url}`);
    });

    app.listen(5002, () => {
        console.log('REST server listening on port 5002');
    });
});

