import jwt from "jsonwebtoken";

export const decodeUserToken = async (token: string) => {
  const decoded = await jwt.verify(
    token,
    (process.env.JWT_SECRET as string) || ""
  );

  return decoded;
};
