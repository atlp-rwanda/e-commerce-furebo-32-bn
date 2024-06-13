import { Router } from "express";
import {
  addItemToCart,
  clearCart,
  createCart,
  getCart,
  updateCart,
} from "../controllers/cart.controller";
import { protectRoute } from "../middlewares/auth.middleware";
import {
   validateAddItemToCart,
    validateClearCart,
     validateUpdateCart
     }
  from "../validations/cart.validate";

const router = Router();


router.post("/", protectRoute, createCart);
router.get("/", protectRoute, getCart);
router.post("/:id", protectRoute, validateAddItemToCart, addItemToCart);  
router.put("/:id", protectRoute, validateUpdateCart, updateCart);
router.post("/", protectRoute, validateClearCart, clearCart); 

export default router;
