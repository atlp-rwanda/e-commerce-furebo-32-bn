import { Request, Response } from "express";
import { orderService } from "../services/order.services";

export class OrderController {
  static async checkout(req: Request, res: Response) {
    const { userId, deliveryAddress, paymentMethod, products } = req.body;

    if (
      !userId ||
      !deliveryAddress ||
      !paymentMethod ||
      !products ||
      products.length === 0
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const totalAmount = products.reduce(
        (acc: number, product: any) => acc + product.price * product.quantity,
        0
      );

      const order = await orderService.createOrder({
        buyerId: userId,
        deliveryAddress,
        paymentMethod,
        status: "pending",
        products,
        totalAmount,
      });

      res.status(201).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
