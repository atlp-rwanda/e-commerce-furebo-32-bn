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
      console.log(cart.items);
      const line_items = cart.items.map(
        (element) => {
          if(element.price === undefined) throw new Error("Price not found");
          if(element.image === undefined) throw new Error("Image not found");

          return({
          price_data: {
            currency: "usd",
            product_data: {
              name: element.productName,
              images:[element.image]
            },
            unit_amount: Math.floor(element.price*100),
          },
          quantity: element.quantity,
        })}
      );
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
      console.log(order.dataValues.orderId);

      const orderId = order.dataValues.orderId;
      await CartService.clearCart(userId);

      // Step 3: Process the payment
      const session = await stripe.checkout.sessions.create({
        line_items: line_items,
        mode: "payment",
        success_url: `https://endearing-cannoli-8d5726.netlify.app/sucessOrder/${orderId}`,
        cancel_url: `https://endearing-cannoli-8d5726.netlify.app/cancelorder/${orderId}`,
      });

      const updatedOrder = await OrderService.updateOrderStatus(
        orderId,
        "Pending"
      );

      // Return order and payment details
      return {
        order: {
          orderId: orderId,
          status: updatedOrder.status,
          totalAmount: totalAmount,
        },
        session: session.url,
      };
    } catch (error: any) {
      throw new Error(
        `Error processing checkout and payment: ${error.message}`
      );
    }
  }
}
