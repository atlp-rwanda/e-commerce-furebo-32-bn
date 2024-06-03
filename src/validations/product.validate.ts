import Joi from "joi";
import { Request, Response, NextFunction } from "express";

// Validation schema for creating a product
const productCreationSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Name is required",
    "any.required": "Name is required",
  }),
  description: Joi.string().required().messages({
    "string.empty": "Description is required",
    "any.required": "Description is required",
  }),
  price: Joi.number().greater(0).required().messages({
    "number.base": "Price must be a number",
    "number.greater": "Price must be a positive number",
    "any.required": "Price is required",
  }),
  stock: Joi.number().integer().greater(0).required().messages({
    "number.base": "Stock must be an integer",
    "number.greater": "Stock must be a positive integer",
    "any.required": "Stock is required",
  }),
  expireDate: Joi.date().iso().required().messages({
    "date.base": "Expire date must be a valid date",
    "any.required": "Expire date is required",
  }),
});

// Validation schema for updating a product
const productUpdateSchema = Joi.object({
  stock: Joi.number().integer().greater(-1).optional().messages({
    "number.base": "Stock must be an integer",
    "number.greater": "Stock must be a positive integer",
  }),
  available: Joi.boolean().optional().messages({
    "boolean.base": "Available must be a boolean",
  }),
  expireDate: Joi.date().iso().optional().messages({
    "date.base": "Expire date must be a valid date",
  }),
});

export const validateProductCreation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = productCreationSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({
      status: "fail",
      data: {
        message: error.details.map((detail) => detail.message).join(", "),
      },
    });
  }
  next();
};

export const validateProductUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = productUpdateSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({
      status: "fail",
      data: {
        message: error.details.map((detail) => detail.message).join(", "),
      },
    });
  }
  next();
};
