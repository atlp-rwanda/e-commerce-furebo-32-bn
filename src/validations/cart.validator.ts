import Joi from "joi";

export const addCartItemSchema = Joi.object({
  productId: Joi.string().uuid().required(),
  quantity: Joi.number().integer().min(1).required(),
});

export const updateCartItemSchema = Joi.object({
  id: Joi.string().uuid().required(),
  quantity: Joi.number().integer().min(1).required(),
});

export const createCartSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
});