import express from "express";
import { CheckoutController } from "../controllers/checkout.controller";
import { protectRoute, restrictTo } from "../middlewares/auth.middleware";
import { userRole } from '../utils/variable.utils';

const checkoutRoutes = express.Router();

checkoutRoutes.post("/checkout",protectRoute, restrictTo(userRole.buyer),CheckoutController.processCheckout);

export default checkoutRoutes;
