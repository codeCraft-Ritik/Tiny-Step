import { verifyToken, getTokenFromRequest } from '../utils/jwt.js';
import User from '../models/User.js';
import ErrorHandler from '../utils/errorHandler.js';

// Middleware to protect routes with JWT
export const protect = async (req, res, next) => {
  try {
    // Get token from request
    const token = getTokenFromRequest(req);

    // Verify token
    const decoded = verifyToken(token);

    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      throw new ErrorHandler('User not found', 404);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new ErrorHandler('Account has been deactivated', 403);
    }

    // Attach user to request
    req.user = user;
    req.userId = user._id;

    next();
  } catch (error) {
    next(error);
  }
};

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next();
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId).select('-password');

    if (user && user.isActive) {
      req.user = user;
      req.userId = user._id;
    }

    next();
  } catch (error) {
    // Silently fail for optional auth
    next();
  }
};

// Middleware to check admin role
export const adminOnly = (req, res, next) => {
  if (!req.user) {
    throw new ErrorHandler('Authentication required', 401);
  }

  if (req.user.role !== 'admin') {
    throw new ErrorHandler('Admin access required', 403);
  }

  next();
};
