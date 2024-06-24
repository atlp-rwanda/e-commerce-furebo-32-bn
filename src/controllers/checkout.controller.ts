import { Request, Response } from "express";
import { CheckoutPaymentService } from "../services/Checkout.services";
import { OrderService } from "../services/order.services";

export class CheckoutController {
  static async processCheckout(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      // const { , paymentMethod } = req.body;
      const deliveryAddress={
          street: "123 Main St",
          city: "Springfield",
          country: "USA",
          zipCode: "12345"
      }
      const paymentMethod={
        method: "credit card",
        cardNumber: "4242 4242 4242 4242",
        expiryDate: "12/25",
        cvv: "123"
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
  static async completePayment(req: Request, res: Response) {
    try {
      const orderId = req.params.orderId;
      const updatedOrder = await OrderService.updateOrderStatus(
        orderId,
        "Paid"
      );
      res.status(200).json({
        updatedOrder
      })
    } catch (error: any) {
    }
  }
  static async cancelPayment(req: Request, res: Response) {
    try {
      const orderId = req.params.orderId;
      const updatedOrder = await OrderService.updateOrderStatus(
        orderId,
        "Canceled"
      );
      res.status(200).json({
        updatedOrder
      })
    } catch (error: any) {
    }
  }
}


