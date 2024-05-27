import { Request, Response, NextFunction } from 'express';
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const checkBlacklist = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    const client = new Client({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
    });

    try {
      await client.connect();
      const result = await client.query('SELECT * FROM blacklisted_tokens WHERE token = $1', [token]);
      if (result.rows.length > 0) {
        return res.status(401).json({
          status: "fail",
          message: "Token has been blacklisted. Please log in again.",
        });
      }
    } catch (error) {
      console.error("Database query error:", error);
      return res.status(500).json({
        status: "error",
        message: "An error occurred while checking the token.",
      });
    } finally {
      await client.end();
    }
  }
  next();
};
