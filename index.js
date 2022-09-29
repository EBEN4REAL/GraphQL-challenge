const express = require("express"); 
const schema = require("./schema");
const { ApolloServer } = require("apollo-server-express");

const server = new ApolloServer({
  typeDefs: schema.typeDefs,
  resolvers: schema.resolvers,
});

const app = express();

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
}

startServer();

app.listen({ port: 4000 }, () =>
  console.log(`Server ready at 
    http://localhost:4000${server.graphqlPath}`)
);
