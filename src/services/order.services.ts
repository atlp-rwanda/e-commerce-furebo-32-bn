import Order from "../database/models/order.model";

export class OrderService {
  static async getOrdertByid(orderId: string) {
    return await Order.findOne({ where: { orderId: orderId } });
  }
  static async createOrder(userId: string, items: any[], deliveryInfo: any, paymentInfo: any, totalAmount:any) {
    try {
      // Create the order
      const order = await Order.create({
        buyerId: userId,
        deliveryAddress: deliveryInfo,
        paymentMethod: paymentInfo,
        status: 'Pending',
        products: items,
        totalAmount,
      });

      return order;
    } catch (error: any) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }
}
