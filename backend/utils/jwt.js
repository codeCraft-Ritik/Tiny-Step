import jwt from 'jsonwebtoken';
import ErrorHandler from './errorHandler.js';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.warn('⚠️ Warning: JWT_SECRET should be at least 32 characters long');
}

// Generate JWT Token
export const generateToken = (userId) => {
  if (!userId) {
    throw new ErrorHandler('User ID is required for token generation', 400);
  }

  try {
    const token = jwt.sign({ userId }, JWT_SECRET, {
      expiresIn: JWT_EXPIRE,
      algorithm: 'HS256',
    });

    return token;
  } catch (error) {
    throw new ErrorHandler('Failed to generate token', 500);
  }
};

// Verify JWT Token
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ErrorHandler('Token has expired. Please login again', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      throw new ErrorHandler('Invalid token. Please login again', 401);
    }
    throw new ErrorHandler('Token verification failed', 401);
  }
};

// Get token from request
export const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new ErrorHandler('No authorization token provided', 401);
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new ErrorHandler('Invalid authorization header format. Use: Bearer <token>', 401);
  }

  return parts[1];
};
