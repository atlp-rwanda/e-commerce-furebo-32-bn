import { Request, Response } from 'express';
import { CheckoutService } from '../services/Checkout.services';
import { PaymentService } from '../services/payment.service';
export class CheckoutController {
  static async processCheckout(req: Request, res: Response) {
    try{
      const userId = req.user.id;
    const { deliveryAddress, paymentMethod } = req.body;

    if (!deliveryAddress || !paymentMethod) {
      return res
        .status(400)
        .json({ message: "Delivery and payment information are required" });
    }

    try {
      const order = await CheckoutService.processOrder(
        userId,
        deliveryAddress,
        paymentMethod
      );
      // //  // Process the payment
        const paymentResult = await PaymentService.processPayment(
          userId,
          order.orderId,
          paymentMethod
        );
      
      return res.status(200).json({
        message: "Order and payment processed successfully",
        data: {
          order,
         payment: paymentResult,
        },
      });
    } catch (error: any) {
      return res
        .status(401)
        .json({
          message: "Unable to process order and payment",
          error: error.message,
        });
    }
    
    } catch (error: any) {
      return res.status(500).json({ message: 'Internal server Error', error: error.message });
    }
  }
}