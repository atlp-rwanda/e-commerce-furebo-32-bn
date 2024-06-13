import Joi from "joi";
import { NextFunction, Request, Response } from "express";


const addItemToCartSchema = Joi.object({
  cartId: Joi.string().uuid().required().messages({
    "string.guid": "Cart ID must be a valid UUID",
    "any.required": "Cart ID is required",
  }),
  productId: Joi.string().uuid().required().messages({
    "string.guid": "Product ID must be a valid UUID",
    "any.required": "Product ID is required",
  }),
  quantity: Joi.number().integer().positive().required().messages({
    "number.base": "Quantity must be a number",
    "number.integer": "Quantity must be an integer",
    "number.positive": "Quantity must be a positive number",
    "any.required": "Quantity is required",
  }),
  description: Joi.string().required().messages({
    "any.required": "Description is required",
  }),
});

export const validateAddItemToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = addItemToCartSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: "fail",
        data: {
          message: error.details.map((detail) => detail.message).join(", "),
        },
      });
    }

    next();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
  


const updateCartSchema = Joi.object({
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().uuid().required().messages({
        "string.guid": "Product ID must be a valid UUID",
        "any.required": "Product ID is required",
      }),
      quantity: Joi.number().integer().positive().required().messages({
        "number.base": "Quantity must be a number",
        "number.integer": "Quantity must be an integer",
        "number.positive": "Quantity must be a positive number",
        "any.required": "Quantity is required",
      }),
    })
  ).required().messages({
    "array.base": "Items must be an array",
    "any.required": "Items are required",
  }),
});

export const validateUpdateCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = updateCartSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: "fail",
        data: {
          message: error.details.map((detail) => detail.message).join(", "),
        },
      });
    }

    next();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


const clearCartSchema = Joi.object({
  cartId: Joi.string().uuid().required().messages({
    "string.guid": "Cart ID must be a valid UUID",
    "any.required": "Cart ID is required",
  }),
});

export const validateClearCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cartId } = req.body; 
    const { error } = clearCartSchema.validate({ cartId }, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: "fail",
        data: {
          message: error.details.map((detail) => detail.message).join(", "),
        },
      });
    }
    next();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
