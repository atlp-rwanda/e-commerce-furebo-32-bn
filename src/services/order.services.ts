
import Order from "../database/models/order.model";


export class OrderService {
  static async getOrdertByid(orderId: string) {
    return await Order.findOne({ where: { orderId: orderId } });
  }

  static async createOrder(
    userId: string,
    items: any[],
    deliveryAddress: any,
    paymentMethod: any,
    totalAmount: any
  ) {
    try {
      // Create the order
      const order = await Order.create({
        buyerId: userId,
        deliveryAddress: deliveryAddress,
        paymentMethod: paymentMethod,
        status: "Pending",
        products: items,
        totalAmount,
      });

      return order;
    } catch (error: any) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }

  static async getOrderById(userId: string) {
    const newOrder = await Order.findOne({ where: { buyerId: userId  } });
    if (!newOrder) {
      throw new Error("Order not found");
    }
    return newOrder
  }


  static async getOrderByItsId(id: string) {
    const newOrder = await Order.findOne({ where: { orderId: id } });
    if (!newOrder) {
      throw new Error("Order not found");
    }
    return newOrder
  }

  static async updateOrderStatus(orderId: string|undefined, status: string) {
    try {
      const [updatedRows, [updatedOrder]] = await Order.update(
        { status },
        { where: { orderId: orderId }, returning: true }
      );

      if (updatedRows === 0) {
        throw new Error("Order not found");
      }

      return updatedOrder;
    } catch (error: any) {
      throw new Error(`Failed to update order status: ${error.message}`);
    }
  }


  static async updateOrderStatusAsAdmin(orderId: string, status: string, expectedDeliveryDate: Date | null) {
    try {
        const updateValues: Partial<Order> = {
            status: status,
            expectedDeliveryDate: expectedDeliveryDate !== null ? expectedDeliveryDate : undefined
        };

        const [updatedRows] = await Order.update(updateValues, {
            where: { orderId: orderId },
            returning: true
        });

        if (updatedRows === 0) {
            throw new Error("Order not found");
        }

        const updatedOrder = await Order.findOne({ where: { orderId: orderId } });
        return updatedOrder;
    } catch (error: any) {
        throw new Error(`Failed to update order status: ${error.message}`);
    }
}



  

  }
  
