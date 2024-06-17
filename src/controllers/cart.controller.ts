import { Request, Response } from "express";
import { CreateCartAttributes, CreateCartItemAttributes } from "../types/cart.types";
/* import Cart from "../database/models/cart.model";  */
import { CartService } from "../services/cart.services";
import { ProductService } from "../services/Product.services";


export const createCart = async (req: Request, res: Response) => {
    try {
      const { name, description, userId } = req.body; 
  
      const cart: CreateCartAttributes = { name, description, userId, items: [], total: 0 };
      const newCart = await CartService.createCart(cart);
  
      return res.status(201).json({
        message: 'Cart created successfully',
        cart: newCart,
      });
    } catch (error) {
      console.error('Error creating cart:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  

  export const addItemToCart = async (req: Request, res: Response) => {
    try {
      const { cartId, productId, quantity } = req.body;
      const userId = (req.user as any).id;
  
      const product = await ProductService.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      const cart = await CartService.getCartById(cartId);
      if (!cart || cart.userId !== userId) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      const newItem: CreateCartItemAttributes = {
        cartId: cart.id!,
        productId,
        productName: product.name,
        price: product.price,
        image: product.image,
        quantity
      };
  
      await CartService.addCartItem(userId, newItem);
  
      const updatedCart = await CartService.getPopulatedCart(cartId);
      
      if (!updatedCart) {
        return res.status(500).json({ message: "Failed to retrieve updated cart" });
      }
    
      return res.status(201).json({
        message: "Item added to cart successfully",
        cart: {
          id: updatedCart.id,
          items: updatedCart.items.map((item: any) => ({
            productId: item.productId,
            productName: item.productName,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
            productDetails: item.productDetails
          }))
        }
      });
    } catch (error) {
      console.error("Error adding item to cart:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

  export const viewCart = async (req: Request, res: Response) => {
    try {
      const { cartId } = req.params;
      const userId = (req.user as any).id;
  
      const cart = await CartService.getCartById(cartId);
  
      if (!cart || cart.userId !== userId) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      const populatedCart = await Promise.all(
        cart.items.map(async (item: CreateCartItemAttributes) => {
          const product = await ProductService.getProductById(item.productId);
          return {
            id: item.productId,
            productId: item.productId,
            productName: item.productName,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
            productDetails: product ? {
              name: product.name,
              price: product.price,
              image: product.image,
            } : null,
          };
        })
      );
  
      res.status(200).json({
        message: "Cart retrieved successfully",
        cart: {
          ...cart,
          items: populatedCart
        }
      });
    } catch (error) {
      console.error("Error viewing cart:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
export const updateCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any).id;
    const cartId = req.params.cartId;
    const cartItems: CreateCartItemAttributes[] = req.body.items;

    for (const item of cartItems) {
      if (item.quantity <= 0 || !Number.isInteger(item.quantity)) {
        res.status(400).json({ error: "Bad Request", message: "Quantity must be a positive integer" });
        return;
      }
    }

    const updatedCart = await CartService.updateCart(userId, cartId, cartItems);

    const populatedCart = await CartService.getPopulatedCart(updatedCart.id);

    res.status(200).json({ message: "Cart updated successfully", cart: populatedCart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export async function clearCart(req: Request, res: Response): Promise<void> {
    const { cartId } = req.params;
    const userId = (req as any).user.id;
  
    try {
      const cartCleared = await CartService.clearCart(userId, cartId);
  
      if (cartCleared) {
        res.status(200).json({ message: 'Cart cleared successfully' });
      } else {
        res.status(404).json({ message: 'Cart not found' });
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
