import { Request, Response } from "express";
import { CheckoutPaymentService } from "../services/Checkout.services";
import { notificationEventEmitter } from "../events/notificationEvents.event";
import { OrderService } from "../services/order.services";

export class CheckoutController {
  static async processCheckout(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const {street,city,country,zipCode}=req.body;
      const deliveryAddress = {
        street: street,
        city: city,
        country: country,
        zipCode: zipCode,
      };
      const paymentMethod = {
        method: "credit card",
        cardNumber: "4242 4242 4242 4242",
        expiryDate: "12/25",
        cvv: "123",
      };

      const result = await CheckoutPaymentService.processCheckoutAndPayment(
        userId,
        deliveryAddress,
        paymentMethod
      );
      notificationEventEmitter.emit("productBought", userId, deliveryAddress);
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
        updatedOrder,
      });
    } catch (error: any) {}
  }
  static async cancelPayment(req: Request, res: Response) {
    try {
      const orderId = req.params.orderId;
      const updatedOrder = await OrderService.updateOrderStatus(
        orderId,
        "Canceled"
      );
      res.status(200).json({
        updatedOrder,
      });
    } catch (error: any) {}
  }
}
