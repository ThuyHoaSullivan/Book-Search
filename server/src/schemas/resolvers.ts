// schemas/resolvers.ts
import User  from '../models/User.js';
import { signToken } from '../services/auth.js';
import type { Context } from './types.js';
import fetch from 'node-fetch'; 

const resolvers = {
    Query: {
      me: async (_parent: unknown, _args: unknown, context: Context) => {
        if (!context.user) throw new Error('Not authenticated');
        return User.findById(context.user._id);
      },
      searchBooks: async (_parent: unknown, { query }: { query: string }) => {
        try {
          const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);
          if (!response.ok) {
            throw new Error('Failed to fetch from Google Books API');
          }
          const data = await response.json();
          return data.items || [];
        } catch (error) {
          console.error(error);
          throw new Error('Google Books search failed');
        }
      }
    },
    Mutation: {
      login: async (_parent: unknown, { email, password }: { email: string; password: string }, _context: Context) => {
        const user = await User.findOne({ email });
        if (!user || !(await user.isCorrectPassword(password))) {
          throw new Error('Incorrect credentials');
        }
        const token = signToken(user.username, user.email, user._id);
        return { token, user };
      },
      addUser: async (_parent: unknown, { username, email, password }: { username: string; email: string; password: string }, _context: Context) => {
        const user = await User.create({ username, email, password });
        const token = signToken(username, email, user._id);
        return { token, user };
      },
      saveBook: async (_parent: unknown, { input }: { input: any }, context: Context) => {
        if (!context.user) throw new Error('Not authenticated');
        return User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedBooks: input } },
          { new: true }
        );
      },
      removeBook: async (_parent: unknown, { bookId }: { bookId: string }, context: Context) => {
        if (!context.user) throw new Error('Not authenticated');
        return User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
      },
    },
  };
  
  export default resolvers;

