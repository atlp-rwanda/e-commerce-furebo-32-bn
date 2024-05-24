import { NextFunction, Request, Response } from "express";
import User from "../database/models/user.model";

export const isUserFound = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    // @ts-ignore
    req.user = user;
    return next();
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
