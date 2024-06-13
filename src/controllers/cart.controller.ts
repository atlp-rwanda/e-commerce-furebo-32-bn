import { Request, Response } from "express";
import { CartService } from "../services/cart.service";
import { validateAddItemToCart } from "../validations/cart.validate";



export const createCart = async (req: Request, res: Response) => {
    try {
      const { userId, name, description } = req.body; 
      const cart = await CartService.createCart(userId, name, description);
      res.status(201).json({
        status: "success",
        data: {
          cart,
        },
      });
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  };
  
export const addItemToCart = async (req: Request, res: Response) => {
  try {
    await validateAddItemToCart(req, res, async () => {
      const { cartId, productId, quantity, description } = req.body;

      const updatedCart = await CartService.addItemToCart(cartId, productId, quantity, description);

      res.status(200).json({
        status: "success",
        data: {
          cart: updatedCart,
        },
      });
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


export const updateCart = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { items } = req.body;

    const updatedCart = await CartService.updateCart(id, items);

    res.status(200).json({
      status: "success",
      data: {
        cart: updatedCart,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
  

  export const getCart = async (_req: Request, res: Response) => {
    try {
      const carts = await CartService.getAllCarts(); 
      res.status(200).json({
        status: "success",
        data: {
          carts,
        },
      });
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  };
  
  
 

  export const clearCart = async (req: Request, res: Response) => {
    try {
      const { cartId } = req.body;
  
      await CartService.clearCart(cartId);
  
      res.status(200).json({
        status: "success",
        message: "Cart cleared successfully",
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
