import { CartService } from './cart.services';
import { OrderService } from './order.services';
import { ProductService } from './Product.services';

export class CheckoutService {
  static async processOrder(
    userId: string,
    deliveryAddress: any,
    paymentMethod: any
  ) {
    try {
      const cart = await CartService.viewCart(userId);
      const totalAmmount = cart.total;
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
        totalAmmount
      );
      await CartService.clearCart(userId);

      return order;
    } catch (error: any) {
      throw new Error(`Error processing order: ${error.message}`);
    }
  }
}
