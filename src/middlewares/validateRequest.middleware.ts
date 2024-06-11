import { NextFunction, Request, Response } from 'express';
import { Schema } from 'joi';

type SchemaType = Schema;

/**
 * Middleware function to validate request body, params, or query against a Joi schema.
 * @param schema Joi schema to validate against.
 * @param path The location of the data to be validated (e.g., 'body', 'params', 'query').
 * @returns Express middleware function.
 */
export const validateRequest =
  (schema: SchemaType, path: 'body' | 'params' | 'query' = 'body') =>
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { error } = schema.validate(req[path]);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      return next();
    } catch (error:any) {
      return res.status(500).json({ message: error.message });
    }
  };
