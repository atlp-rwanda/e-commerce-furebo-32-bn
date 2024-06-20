import stripe from "../database/config/stripe.config";
import { CartService } from "./cart.services";
import { OrderService } from "./order.services";
import { ProductService } from "./Product.services";

export class CheckoutPaymentService {
  static async processCheckoutAndPayment(
    userId: string,
    deliveryAddress: any,
    paymentMethod: any
  ) {
    try {
      // Step 1: Process the order
      const cart = await CartService.viewCart(userId);
      const totalAmount = cart.total;

      if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty");
      }

      for (const item of cart.items) {
        const inventorySuccess = await ProductService.updateInventory(
          item.productId,
          item.quantity
        );
        if (!inventorySuccess) {
          throw new Error(
            `Insufficient inventory for product ${item.productId}`
          );
        }
      }

      const order = await OrderService.createOrder(
        userId,
        cart.items,
        deliveryAddress,
        paymentMethod,
        totalAmount
      );

      await CartService.clearCart(userId);

      // Step 2: Create a payment method

      const paymentMethodResult = await stripe.paymentMethods.create({
        type: "card",
        card: {
          number: paymentMethod.cardNumber,
          exp_month: parseInt(paymentMethod.expiryDate.split("/")[0]),
          exp_year: parseInt(paymentMethod.expiryDate.split("/")[1]),
          cvc: paymentMethod.cvv,
        },
        billing_details: {
          name: userId, // Replace with actual user name if available
        },
      });

      // Step 3: Process the payment
      const paymentIntent = await stripe.paymentIntents.create({
        amount: order.totalAmount * 100, // Amount in cents
        currency: "usd",
        payment_method: paymentMethodResult.id,
        confirm: true,
      });

      if (paymentIntent.status !== "succeeded") {
        throw new Error("Payment failed");
      }

      // Update the order status to Paid
      const updatedOrder = await OrderService.updateOrderStatus(
        order.orderId,
        "Paid"
      );

      // Return order and payment details
      return {
        order: {
          orderId: order.orderId,
          status: updatedOrder.status,
          totalAmount: totalAmount,
        },
        payment: {
          paymentIntentId: paymentIntent.id,
        },
      };
    } catch (error: any) {
      throw new Error(
        `Error processing checkout and payment: ${error.message}`
      );
    }
  }
}
