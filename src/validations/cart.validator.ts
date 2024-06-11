import Joi from "joi";

export const addCartItemSchema = Joi.object({
  productId: Joi.string().uuid().required(),
  quantity: Joi.number().integer().min(1).required(),
});

export const updateCartItemSchema = Joi.object({
  id: Joi.string().uuid().required(),
  quantity: Joi.number().integer().min(1).required(),
});
