import jwt from "jsonwebtoken";
import { UserAttributes } from "../types/user.types";
import dotenv from "dotenv";

dotenv.config();

const generateToken = async (user: UserAttributes, expiresIn: string = "30d") => {
  return jwt.sign(
    {
      role: user.role,
      email: user.email,
      id: user.id,
      firstName: user.firstName,
    },
    process.env.JWT_SECRET || "",
    {
      expiresIn: expiresIn,
    }
  );
};
export { generateToken };




export const decodeToken = (token: string): any => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
