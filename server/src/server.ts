import express from 'express';
import mongoose from 'mongoose';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getUserFromToken } from './services/auth.js';
import { typeDefs, resolvers } from './schemas/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks')
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    startServer();
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

app.use(cors());
app.use(express.json());



async function startServer() {
  try {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    await server.start();

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

    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../client/build')));
      app.get('*', (_, res) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'));
      });
    }

    app.listen(PORT, () => {
      console.log(`🚀 GraphQL server running at http://localhost:${PORT}/graphql`);
    });

  } catch (err) {
    console.error('❌ Failed to start server:', err);
  }
}
