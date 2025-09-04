/**
 * Authentication and Authorization Middleware
 * Handles JWT validation and role-based access control
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    tenantId: string;
    roles: string[];
  };
}

/**
 * Authenticate user via JWT token
 */
export const authenticateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        tenant: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      tenantId: user.tenantId,
      roles: user.roles
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
};

/**
 * Authorize based on required roles
 */
export const authorizeRole = (requiredRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const hasRole = requiredRoles.some(role => req.user!.roles.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
    }

    next();
  };
};

/**
 * Check Segregation of Duties (SoD) policy
 */
export const checkSoD = (action: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    try {
      // Check if user created the resource they're trying to approve
      const resourceId = req.params.id;
      if (action === 'approve' && resourceId) {
        const resource = await prisma.aISystem.findFirst({
          where: {
            id: resourceId,
            ownerId: req.user.id
          }
        });

        if (resource) {
          // Creator cannot approve their own submission
          return res.status(403).json({
            success: false,
            error: 'Segregation of Duties violation: Creator cannot approve their own submission'
          });
        }
      }

      next();
    } catch (error) {
      console.error('SoD check error:', error);
      next();
    }
  };
};

/**
 * Rate limiting middleware
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = (maxRequests: number = 100, windowMs: number = 60000) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const key = req.user?.id || req.ip;
    const now = Date.now();
    const limit = rateLimitStore.get(key);

    if (limit) {
      if (now > limit.resetTime) {
        // Reset the counter
        rateLimitStore.set(key, {
          count: 1,
          resetTime: now + windowMs
        });
      } else if (limit.count >= maxRequests) {
        const retryAfter = Math.ceil((limit.resetTime - now) / 1000);
        return res.status(429).json({
          success: false,
          error: 'Too many requests',
          retryAfter
        });
      } else {
        limit.count++;
      }
    } else {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
    }

    next();
  };
};

export default {
  authenticateUser,
  authorizeRole,
  checkSoD,
  rateLimit
};