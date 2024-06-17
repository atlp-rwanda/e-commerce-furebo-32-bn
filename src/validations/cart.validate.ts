import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';


export const cartValidationSchema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
      "string.min": "Cart name must be at least 3 characters long",
      "string.max": "Cart name cannot exceed 100 characters",
      "any.required": "Cart name is required",
    }),
    description: Joi.string().min(10).max(1000).required().messages({
      "string.min": "Description must be at least 10 characters long",
      "string.max": "Description cannot exceed 1000 characters",
      "any.required": "Description is required",
    }),
   
  }).options({ abortEarly: false });

  export const validateCreateCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = await cartValidationSchema.validateAsync(req.body);
      if (error) {
        return res.status(400).json({
          status: 'fail',
          data: {
            message: error.details[0].message,
          },
        });
      }
      next();
    } catch (error) {
      console.error('Error validating create cart:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };


  export const addItemToCartValidationSchema = Joi.object({
    cartId: Joi.string().uuid().required().messages({
      "string.guid": "Cart ID must be a valid UUID",
      "any.required": "Cart ID is required",
    }),
    productId: Joi.string().uuid().required().messages({
      "string.guid": "Product ID must be a valid UUID",
      "any.required": "Product ID is required",
    }),
    quantity: Joi.number().integer().min(1).required().messages({
      "number.base": "Quantity must be a number",
      "number.integer": "Quantity must be an integer",
      "number.min": "Quantity must be at least 1",
      "any.required": "Quantity is required",
    }),
  });
  
  export const validateAddItemToCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = await addItemToCartValidationSchema.validateAsync(req.body, { abortEarly: false });
      if (error) {
        return res.status(400).json({
          status: 'fail',
          data: {
            message: error.details.map((detail: { message: any; }) => detail.message).join(', '),
          },
        });
      }
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

export const updateCartValidationSchema = Joi.object({
    items: Joi.array().items(Joi.object({
      productId: Joi.string().uuid().required().messages({
        "string.guid": "Product ID must be a valid UUID",
        "any.required": "Product ID is required",
      }),
      quantity: Joi.number().integer().min(1).required().messages({
        "number.base": "Quantity must be a number",
        "number.integer": "Quantity must be an integer",
        "number.min": "Quantity must be at least 1",
        "any.required": "Quantity is required",
      }),
    })).min(1).required().messages({
      "array.min": "At least one item must be provided",
      "any.required": "Items are required",
    }),
  });


export const validateUpdateCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = await updateCartValidationSchema.validateAsync(req.body, { abortEarly: false });
      if (error) {
        return res.status(400).json({
          status: 'fail',
          data: {
            message: error.details.map((detail: any) => detail.message).join(', '),
          },
        });
      }
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };