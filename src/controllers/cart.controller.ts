import { Request, Response } from "express";
import { CartService } from "../services/cart.services";


export class CartController {
  static async createCart(req: Request, res: Response) {
    const userId = req.user.id;
    try {
      const cart = await CartService.createCart(userId);
      return res.status(201).json({
        message: "Cart created successfully",
        cartId: cart.id,
        items: cart.items,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
  static async addItemToCart(req: Request, res: Response) {
    const userId = req.user.id;
    const { productId } = req.params;

    try {
      const cart = await CartService.addItemToCart(userId, productId);
      return res.status(200).json({
        message: "Item added to cart successfully",
        cart,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async viewCart(req: Request, res: Response) {
    const userId = req.user.id;
    try {
      const cart = await CartService.viewCart(userId);
      return res.status(200).json(cart);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async updateCartItem(req: Request, res: Response) {
    const userId = req.user.id;
    const { productId } = req.params || {}; // Ensure productId is defined
    const { quantity } = req.body;

    if (typeof quantity !== "number" || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    try {
      const cart = await CartService.updateCartItem(
        userId,
        productId,
        quantity
      );
      return res.status(200).json({
        message: "Cart updated successfully",
        cart,
      });
    } catch (error: any) {
      if (
        error.message === "Cart not found" ||
        error.message === "Product not found in cart" ||
        error.message.includes("Product with ID")
      ) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async clearCart(req: Request, res: Response) {
    const userId = req.user.id;
    try {
      const cart = await CartService.clearCart(userId);
      return res.status(200).json({
        message: "Cart cleared successfully",
        cart,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async removeCartItem(req: Request, res: Response) {
    const userId = req.user.id;
    const { productId } = req.params;

    try {
      const cart = await CartService.removeCartItem(userId, productId);
      return res.status(200).json({
        message: "Item removed from cart successfully",
        cart,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
