import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { isBlacklisted } from "../utils/tokenBlacklist";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    token = req.headers.authorization.split(" ")[1];
    const jwt_secret: string | undefined = process.env.JWT_SECRET;
    if (!jwt_secret) {
      return res.status(401).json({ message: "JWT_SECRET is missing" });
    }

    if (isBlacklisted(token)) {
      return res.status(401).json({ message: "Token has been invalidated." });
    }

    jwt.verify(token, jwt_secret, async (err, user) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Unauthorized request, Try again" });
      } else {
        req.user = user;
        next();
      }
    });
  } catch (err) {
    console.log(err, "Error occurred");
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const restrictTo = (...roles: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You are not authorized to perform this action",
      });
    }
    next();
  };
};

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
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