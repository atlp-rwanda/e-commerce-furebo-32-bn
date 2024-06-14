import express from "express";
import { handlePayment } from "../controllers/payment.controller";

const router = express.Router();

// POST /api/payment
router.post("/payment", handlePayment);

export default router;
