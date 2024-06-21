import express from "express";
import { CheckoutController } from "../controllers/checkout.controller";
import { protectRoute, restrictTo } from "../middlewares/auth.middleware";
import { userRole } from '../utils/variable.utils';

const router= express.Router();

router.post("/checkout",protectRoute, restrictTo(userRole.buyer),CheckoutController.processCheckout);

export default router;
