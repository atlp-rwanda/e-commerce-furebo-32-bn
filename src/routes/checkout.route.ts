import express from "express";
import { OrderController } from "../controllers/order.controller";

const router = express.Router();

router.post("/checkout", OrderController.checkout);

export default router;
