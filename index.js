const express =  require("express");
const { resolvers } =  require("./resolvers");
const { typeDefs } =  require("./schema");
const  { ApolloServer } =  require("apollo-server-express");

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
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
