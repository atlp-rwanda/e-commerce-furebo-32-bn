import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

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

// export const isVerfied = (req: Request, res: Response, next: NextFunction) => {
//   if (!req.user.verfied) {
//     return res.status(403).json({
//       message: "You are not authorized to perform this action",
//     });
//   }
//   next();
// };