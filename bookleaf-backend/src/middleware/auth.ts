import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { JWTPayload, UserRole } from '../types/auth';

// Explicitly extend the Express Request type to clear local TS validation errors
export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

/**
 * Middleware to verify if the incoming request has a valid JWT token
 */
export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <TOKEN>"

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token required. Please log in.' 
    });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as JWTPayload;
    req.user = decoded; // Mount the decoded payload onto the request object
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      message: 'Access token is invalid or expired.' 
    });
  }
};

/**
 * Middleware to restrict route access based on user roles (Role-Based Access Control)
 */
export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized identity context.' 
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Forbidden: You do not have permission to access this resource.' 
      });
    }

    next();
  };
};