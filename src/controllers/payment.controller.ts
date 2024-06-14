import { Request, Response } from "express";
import { processPayment } from "../services/payment.service";

export async function handlePayment(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { token, amount, description, orderId } = req.body;

    if (!token || !amount || !description || !orderId) {
      res.status(400).json({ error: "Missing required parameters" });
      return;
    }

    const paymentIntent = await processPayment(token, amount, description);

    const orderConfirmation = {
      orderId: orderId,
      amount: amount,
      currency: "usd",
      expectedDelivery: "2024-06-14",
    };
    res.status(200).json({
      message: "Payment successful",
      order: orderConfirmation,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    console.error("Error processing payment:", err);
    res.status(500).json({ error: "Payment failed" });
  }
}
