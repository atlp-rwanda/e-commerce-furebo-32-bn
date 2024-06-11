import { Request, Response } from "express";
import { CartService } from "../services/cart.service";
import { ProductService } from "../services/Product.services";

export const addItemToCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { productId, quantity } = req.body;

    const product = await ProductService.getProductByid(productId); 
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const cartItem = await CartService.addItemToCart({ userId, productId, quantity });
    return res.status(200).json({ message: "Item added to cart", cartItem });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const viewCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
 
    const cart = await CartService.getCartByUserId(userId);
    const cartTotal = cart.reduce((total, item) => total + item.quantity * item.Product.price, 0);

    return res.status(200).json({ cart, cartTotal });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { id, quantity } = req.body;

    const cartItem = await CartService.updateCartItem({ id, userId, quantity });
    return res.status(200).json({ message: "Cart item updated", cartItem });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await CartService.clearCart(userId);
    return res.status(200).json({ message: "Cart cleared" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
