// server.js

console.profile('myProfile');

const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
const translate = require('node-google-translate-skidz');
const tts = require('google-tts-api');

const app = express();

const dataStore = {}; // Simple in-memory "notarealdb"

const resolvers = {
  Query: {
    getData: (parent, { id }) => {
      const data = dataStore[id];
      if (data) {
        return {
          id,
          sentence: data.sentence,
          translatedSentence: data.translatedSentence.translation,
          audioUrl: data.audioUrl,
        };
      }
      return null;
    },
  },
  Mutation: {
    postData: async (parent, { id, sentence }) => {
      // Translate the sentence to Hindi
      const translatedSentence = await translate({
        text: sentence,
        source: 'en',
        target: 'hi',
      });

      console.log('Translated Result:', translatedSentence);

       // Generate the audio URL for the translated sentence
       const audioUrl = tts.getAudioUrl(translatedSentence.translation, {
        lang: 'hi',
        slow: false,
        host: 'https://translate.google.com',
      });

      // Store the data in "notarealdb"
      dataStore[id] = { id, sentence, translatedSentence, audioUrl };

      return {
        id,
        sentence,
        translatedSentence,
        audioUrl,
      };
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

(async () => {
  await server.start(); // Make sure to await the server start before applying middleware
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;

  app.listen({ port: PORT }, () => {
    console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
})();


console.profile('myProfile');