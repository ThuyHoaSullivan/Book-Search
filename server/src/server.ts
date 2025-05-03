import express from 'express';
import mongoose from 'mongoose';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import { getUserFromToken } from './services/auth.ts';
import { typeDefs, resolvers } from './schemas/index.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001; // Set the PORT variable

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks')
  .then(() => {
    console.log('Connected to MongoDB Atlas successfully');
    startServer(); // Start the server once connected to MongoDB
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB Atlas:', err);
  });

app.use(cors());
app.use(express.json());

async function startServer() {
  try {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    // Start Apollo Server
    await server.start();

    // Use Apollo middleware for GraphQL requests
    app.use(
      '/graphql',
      expressMiddleware(server, {
        context: async ({ req }) => {
          const authHeader = req.headers.authorization || '';
          const user = getUserFromToken(authHeader);
          return { user };
        },
      })
    );

    // Serve static assets in production
    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../client/build')));
    }

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 GraphQL server running at http://localhost:${PORT}/graphql`);
    });

  } catch (err) {
    console.error('❌ Failed to start server:', err);
  }
}