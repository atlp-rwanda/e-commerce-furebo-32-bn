import Cart from "../database/models/cart.model";
import Product from "../database/models/Product.model";
import { createCartAttributes, updateCartAttributes } from "../types/cart.types";

export class CartService {
    static async addItemToCart(cartItem: createCartAttributes) {
        try {
            // Check if the item already exists in the cart
            const existingItem = await Cart.findOne({
                where: {
                    userId: cartItem.userId,
                    productId: cartItem.productId,
                },
            });
    
            if (existingItem) {
                // If item exists, update the quantity
                existingItem.quantity += cartItem.quantity;
                await existingItem.save();
                return existingItem;
            }
    
            // If item doesn't exist, create a new cart item
            const newCartItem = await Cart.create({
                userId: cartItem.userId,
                productId: cartItem.productId,
                quantity: cartItem.quantity,
            });
    
            return newCartItem;
        } catch (error:any) {
            throw new Error("Failed to add item to cart: " + error.message);
        }
    }
    

  static async getCartByUserId(userId: string) {
    return await Cart.findAll({
      where: { userId },
      include: [{ model: Product, attributes: ["productName", "price", "images"] }],
    });
  }

  static async updateCartItem(cartItem: updateCartAttributes) {
    const item = await Cart.findOne({
      where: {
        id: cartItem.id,
        userId: cartItem.userId,
      },
    });

    if (item) {
      item.quantity = cartItem.quantity;
      await item.save();
      return item;
    }

    throw new Error("Cart item not found");
  }

  static async clearCart(userId: string) {
    return await Cart.destroy({ where: { userId } });
  }

  static async viewCart(userId: string) {
    return await Cart.findAll({
      where: { userId },
      include: [{ model: Product, attributes: ["productName", "price", "images"] }],
    });
  }
}


