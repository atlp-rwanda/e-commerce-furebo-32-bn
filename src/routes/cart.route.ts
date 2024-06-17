// File: src/routes/cart.routes.ts

import express from "express";
import { createCart, addItemToCart, viewCart, updateCart,clearCart } from "../controllers/cart.controller";
import { validateCreateCart, validateAddItemToCart, validateUpdateCart } from "../validations/cart.validate";
import { protectRoute } from "../middlewares/auth.middleware";

const router = express.Router();

// Routes
router.post("/createCart", protectRoute, validateCreateCart, createCart);
router.post("/addItemToCart", protectRoute, validateAddItemToCart, addItemToCart);
router.get("/viewCart/:cartId", protectRoute, viewCart);
router.post("/updateCart/:cartId", protectRoute, validateUpdateCart, updateCart);
router.post('/clear/:cartId', protectRoute, clearCart);

export default router;
