import Joi from 'joi';
import {NextFunction, Request, Response } from 'express';
// import { ProductService } from '../services/Product.services';

// Define the Joi schema for product validation
export const productValidationSchema = Joi.object({
  productName: Joi.string().min(3).max(100).required().messages({
    "string.min": "Product name must be at least 3 characters long",
    "string.max": "Product name cannot exceed 100 characters",
    "any.required": "Product name is required",
  }),
  category: Joi.string().min(3).max(50).required().messages({
    "string.min": "Category must be at least 3 characters long",
    "string.max": "Category cannot exceed 50 characters",
    "any.required": "Category is required",
  }),
  price: Joi.number().positive().required().messages({
    "number.base": "Price must be a number",
    "number.positive": "Price must be a positive number",
    "any.required": "Price is required",
  }),
  quantity: Joi.number().integer().positive().required().messages({
    "number.base": "Quantity must be a number",
    "number.integer": "Quantity must be an integer",
    "number.positive": "Quantity must be a positive number",
    "any.required": "Quantity is required",
  }),
  description: Joi.string().min(10).max(1000).required().messages({
    "string.min": "Description must be at least 10 characters long",
    "string.max": "Description cannot exceed 1000 characters",
    "any.required": "Description is required",
  }),
  expireDate: Joi.date().iso().required().messages({
    "date.base": "Expire date must be a valid date",
    "any.required": "Expire date is required",
  }),
});

// Validation function for creating a product
export const validateCreateProduct =  async(req: Request, res: Response,next:NextFunction) => {
    try{
        console.log(req.body) 
        const { error } = await productValidationSchema.validateAsync(req.body, { abortEarly: false });
        if (error) {
          return res.status(400).json({
            status: 'fail',
            data: {
              message: error.details[0].message,
              b:req.body
            },
          });
        }
    //     const {productName}=req.body
    //     const product = await ProductService.getProductByName(productName);
    //     if (product) {
    //       return res.status(409).json({
    //         message: "Product alreadyExists try again",
    //       })
    //   }
      next();
    }
    catch (error){
        console.log(error)
    }
}

import { Schema } from 'joi'

type SchemaType = Schema

export const validateRequest =
  (schema: SchemaType, path: 'body' | 'params' | 'query' = 'body') =>
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { error } = schema.validate(req[path])
    console.log(req[path])
    if (error) {
      return res.status(400).json({ message: error.details[0].message })
    }
    return next()
  }

  export const validateReviewData = (review: string, rating: number, res: Response) => {
    if (!review || !rating) {
      res.status(400).json({ message: "Please provide a review and rating" });
      return false;
    }
    if (rating < 1 || rating > 5) {
      res.status(400).json({ message: "Rating should be between 1 and 5" });
      return false;
    }
    return true;
  };
