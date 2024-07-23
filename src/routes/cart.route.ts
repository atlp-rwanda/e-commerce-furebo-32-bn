
import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import { protectRoute, restrictTo } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", protectRoute, restrictTo("buyer"), CartController.createCart);
router.post("/add/:productId", protectRoute, restrictTo("buyer"), CartController.addItemToCart);
router.get("/view", protectRoute, restrictTo("buyer"), CartController.viewCart);
router.patch("/update/:productId", protectRoute, restrictTo("buyer"), CartController.updateCartItem);
router.post("/clear", protectRoute, restrictTo("buyer"), CartController.clearCart);
router.delete(
  "/remove/:productId",
  protectRoute,
  restrictTo("buyer"),
  CartController.removeCartItem
);

export default router;
