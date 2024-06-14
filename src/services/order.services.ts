import Order from "../database/models/order.model";
import { orderCreationAttributes } from "../types/order.types";
export class orderService {
  static async createOrder(orderData: orderCreationAttributes) {
    const order = await Order.create(orderData);
    return order;
  }
  static async getOrdertByid(orderId: string) {
    return await Order.findOne({ where: { orderId: orderId } });
  }
}
