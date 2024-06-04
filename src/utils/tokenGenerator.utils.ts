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
    },
    process.env.JWT_SECRET || "",
    {
      expiresIn: expiresIn,
    }
  );
};
export { generateToken };



export const generateResetToken = (user: UserAttributes) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: "1h", // Token expires in 1 hour
  });
};

export const decodeToken = (token: string): any => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
