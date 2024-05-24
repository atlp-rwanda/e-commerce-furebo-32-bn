import jwt, { sign } from "jsonwebtoken";
import { UserAttributes } from "../types/user.types";
import dotenv from "dotenv";

dotenv.config();

export const generateResetToken = (email: string): string => {
  const token = sign( {
    email:email
  },
  process.env.JWT_SECRET || "",
  {
    expiresIn: "30m",
  });
  return token;
};

const generateToken = async (user: UserAttributes) => {
  return jwt.sign(
    {
      role: user.role,
      email: user.email,
      id: user.id,
    },
    process.env.JWT_SECRET || "",
    {
      expiresIn: "24h",
    }
  );
};
export { generateToken };
