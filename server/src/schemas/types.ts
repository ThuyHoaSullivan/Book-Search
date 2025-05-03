import { UserDocument } from '../models/User.ts';

export interface BookInput {
  bookId: string;
  authors?: string[];
  description: string;
  title: string;
  image?: string;
  link?: string;
}

export interface AuthPayload {
  token: string;
  user: UserDocument;
}

export interface Context {
  user?: {
    _id: string;
    username: string;
    email: string;
  };
}

export interface Resolvers {
  Query: {
    me: (parent: unknown, args: unknown, context: Context) => Promise<UserDocument | null>;
  };
  Mutation: {
    login: (parent: unknown, args: { email: string; password: string }, context: Context) => Promise<AuthPayload>;
    addUser: (parent: unknown, args: { username: string; email: string; password: string }, context: Context) => Promise<AuthPayload>;
    saveBook: (parent: unknown, args: { input: BookInput }, context: Context) => Promise<UserDocument | null>;
    removeBook: (parent: unknown, args: { bookId: string }, context: Context) => Promise<UserDocument | null>;
  };
}
