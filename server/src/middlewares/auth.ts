import { Request, Response, NextFunction } from 'express';
import { Role } from '../types/enums';
import { verifyAdminToken, AdminPayload } from '../lib/jwt';

// Extend Express Request interface to include admin
declare global {
  namespace Express {
    interface Request {
      admin?: AdminPayload;
    }
  }
}

export function authenticateAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Missing or malformed Authorization header with Bearer token',
      },
    });
    return;
  }

  const token = authHeader.substring(7).trim();

  try {
    const payload = verifyAdminToken(token);
    req.admin = payload;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired Bearer token',
      },
    });
  }
}

export function requireRole(requiredRole: Role) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.admin) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
      return;
    }

    if (requiredRole === Role.SUPER_ADMIN && req.admin.role !== Role.SUPER_ADMIN) {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions. Super Administrator role required.',
        },
      });
      return;
    }

    next();
  };
}
