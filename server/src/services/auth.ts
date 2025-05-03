import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export interface JwtPayload {
  _id: unknown;
  username: string;
  email: string,
}

export interface GraphQLContext {
  user?: JwtPayload;
}

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

// Replaces Express middleware with a GraphQL context parser
// This is used in Apollo Server's `context` function
export const getUserFromToken = (authHeader?: string): JwtPayload | undefined => {
  if (!authHeader) return;

  const token = authHeader.split(' ')[1];
  const secretKey = process.env.JWT_SECRET_KEY || '';

  try {
    return jwt.verify(token, secretKey) as JwtPayload;
  } catch (err) {
    console.error('JWT verification failed:', err);
    return;
  }
};