const { gql } = require("apollo-server-express");
const resolvers = require("./resolvers").resolvers;

const typeDefs = gql`
  type Link {
    url: String
    title: String
  }

  type Record {
    mentions: [String]
    emoticons: [String]
    links: [Link]
  }

  type Query {
    records(message: String): Record
  }
`;

module.exports = { typeDefs, resolvers };
