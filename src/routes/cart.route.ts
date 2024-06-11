import express from "express";
import { addItemToCart, viewCart, updateCartItem, clearCart, createCart } from "../controllers/cart.controller";
import { protectRoute } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import { addCartItemSchema, createCartSchema, updateCartItemSchema } from "../validations/cart.validator";

const router = express.Router();
router.post("/create", protectRoute, validateRequest(createCartSchema), createCart);
router.post("/add", protectRoute, validateRequest(addCartItemSchema), addItemToCart);
router.get("/", protectRoute, viewCart);
router.post("/update", protectRoute, validateRequest(updateCartItemSchema), updateCartItem);
router.delete("/clear", protectRoute, clearCart);

export default router;
