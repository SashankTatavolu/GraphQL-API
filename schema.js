// schema.js
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Data {
    id: String
    sentence: String
    translatedSentence: String
    audioUrl: String
  }

  type Query {
    getData(id: String): Data
  }

  type Mutation {
    postData(id: String, sentence: String): Data
  }
`;

module.exports = typeDefs;
