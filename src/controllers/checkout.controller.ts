import { Request, Response } from "express";
import { CheckoutPaymentService } from "../services/Checkout.services";

export class CheckoutController {
  static async processCheckout(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const { deliveryAddress, paymentMethod } = req.body;

      if (!deliveryAddress || !paymentMethod) {
        return res
          .status(400)
          .json({ message: "Delivery and payment information are required" });
      }

      const result = await CheckoutPaymentService.processCheckoutAndPayment(
        userId,
        deliveryAddress,
        paymentMethod
      );

      return res.status(200).json({
        message: "Order and payment processed successfully",
        data: result,
      });
    } catch (error: any) {
      return res.status(401).json({
        message: "Unable to process order and payment",
        error: error.message,
      });
    }
  }
}
