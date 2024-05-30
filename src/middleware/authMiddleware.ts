import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { isBlacklisted } from '../utils/tokenBlacklist';

interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}

// Define a custom interface by extending the Request interface
interface AuthRequest extends Request {
  user?: DecodedToken; // Add user property to the Request interface
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Access denied. No token provided.",
    });
  }

  if (isBlacklisted(token)) {
    return res.status(401).json({
      status: "error",
      message: "Token has been invalidated.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as DecodedToken;
    req.user = decoded; 
    next();
  } catch (error) {
    console.error("Invalid token:", error);
    return res.status(401).json({
      status: "error",
      message: "Invalid token.",
    });
  }
};
