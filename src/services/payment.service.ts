import stripe from "../database/config/stripe.config";
import { OrderService } from "./order.services";

export class PaymentService {
  static async processPayment(
    userId: string,
    orderId: string,
    paymentMethod: string
  ) {
    try {
      // Fetch the order details
      const order = await OrderService.getOrdertByid(orderId);

      if (!order) {
        throw new Error("Order not found");
      }

      if (order.buyerId !== userId) {
        throw new Error("Unauthorized access to order");
      }

      // Create a Payment Intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: order.totalAmount * 100, // Amount in cents
        currency: "usd",
        payment_method: paymentMethod,
        confirm: true,
      });

      if (paymentIntent.status !== "succeeded") {
        throw new Error("Payment failed");
      }

      // Update the order status
      const updatedOrder = await OrderService.updateOrderStatus(
        orderId,
        "Paid"
      );

      // Return payment confirmation details
      return {
          orderId:orderId,
        status: updatedOrder.status,
        totalAmount: order.totalAmount,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error: any) {
      throw new Error(`Error processing payment: ${error.message}`);
    }
  }
}
