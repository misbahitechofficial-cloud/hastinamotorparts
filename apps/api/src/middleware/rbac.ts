import { Request, Response, NextFunction } from 'express';

export function requireRole(...allowedRoles: Array<'SUPER_ADMIN' | 'CATALOGUE' | 'SALES'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Requires one of roles: [${allowedRoles.join(', ')}]`
      });
    }

    return next();
  };
}
