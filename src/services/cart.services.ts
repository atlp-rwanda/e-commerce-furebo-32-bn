import Cart from "../database/models/cart.model";
import Product from "../database/models/Product.model";
import { CreateCartAttributes, CreateCartItemAttributes } from "../types/cart.types";
/* import { ProductService } from "./Product.services"; */

export class CartService {
  static async createCart(cart: CreateCartAttributes) {
    return await Cart.create(cart);
  }

  static async getCartByUserId(userId: string) {
    return await Cart.findOne({
      where: { userId },
    });
  }
  static async getCartById(cartId: string) {
    return await Cart.findByPk(cartId);
  }

 
  
  static async addCartItem(_userId: string, newItem: CreateCartItemAttributes) {
    const cart = await this.getCartById(newItem.cartId);
    if (!cart) {
      throw new Error("Cart not found");
    }
    if (cart) {
      const existingItemIndex = cart.items.findIndex((item: any) => item.productId === newItem.productId);

      if (existingItemIndex !== -1) {
        cart.items[existingItemIndex].quantity += newItem.quantity;
      } else {
        cart.items.push({
          cartId: cart.id,
          productId: newItem.productId,
          productName: newItem.productName,
          price: newItem.price,
          image: newItem.image,
          quantity: newItem.quantity,
        });
      }

      cart.total = this.calculateCartTotal(cart.items);
      await cart.save();
    }

    return cart;
  }

  static async getProductById(productId: string) {
    return await Product.findByPk(productId);
  }

  static async updateCart(userId: string, cartId: string, cartItems: CreateCartItemAttributes[]) {
    const cart = await Cart.findOne({ where: { id: cartId, userId } });
  
    if (!cart) {
      throw new Error("Cart not found");
    }
  
    
    for (const item of cartItems) {
      const product = await Product.findOne({ where: { id: item.productId } });
      if (!product) {
        throw new Error(`Product not found for productId: ${item.productId}`);
      }
      item.price = product.price; 
      
    }
  
    cart.items = cartItems;
    cart.total = this.calculateCartTotal(cart.items);
    await cart.save();
  
    return cart;
  }
  

  
  
  static async getPopulatedCart(cartId: string) {
    const cart = await Cart.findByPk(cartId);

    if (!cart) {
      throw new Error("Cart not found");
    }

    const populatedItems = await Promise.all(
      cart.items.map(async (item: CreateCartItemAttributes) => {
        const product = await this.getProductById(item.productId);
        return {
          ...item,
          productDetails: product ? {
            name: product.name,
            price: product.price,
            image: product.image,
          } : null,
        };
      })
    );

    return {
      ...cart.toJSON(),
      items: populatedItems,
    };
  }

  static async getCartItems(cartId: string) {
    const cart = await Cart.findByPk(cartId);

    if (!cart) {
      throw new Error("Cart not found");
    }

    return cart.items;
  }

  static calculateCartTotal(cartItems: CreateCartItemAttributes[]) {
    let total = 0;
    for (const item of cartItems) {
      if (item.price !== undefined) {
        total += item.price * item.quantity;
      } else {
        throw new Error(`Item price is undefined for productId: ${item.productId}`);
      }
    }
    return total;
  }

  
  static async clearCart(userId: string, cartId: string) {
    try {
      const cart = await Cart.findOne({ where: { id: cartId, userId } });

      if (!cart) {
        return false;
      }

      cart.items = [];
      cart.total = 0;
      await cart.save();

      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw new Error('Internal Server Error');
    }
  }

}
