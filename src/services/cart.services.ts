
import Cart from "../database/models/cart.model";
import Product from "../database/models/Product.model";


export class CartService {
  static async createCart(userId: string) {
    return await Cart.create({ userId });
  }
  static async addItemToCart(userId: string, productId: string) {
    try {
      let cart = await Cart.findOne({ where: { userId } });
      if (!cart) {
        cart = await Cart.create({ userId, items: [], total: 0 });
      }

      const product = await Product.findByPk(productId);
      if (!product) {
        throw new Error("Product not found");
      }

      const updatedItems = cart.items.map(item =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

      if (!updatedItems.some(item => item.productId === productId)) {
        updatedItems.push({ productId, quantity: 1 });
      }

      cart.items = updatedItems;
      cart.total += product.price;

      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      console.error("Error adding item to cart: ", error);
      throw new Error("Could not add item to cart");
    }
  }
  
  


  static async viewCart(userId: string) {
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      throw new Error("Cart not found");
    }

    if (cart.items.length === 0) {
      return {
        ...cart.toJSON(),
        items: []  
      };
    }

    const products = await Product.findAll({
      where: {
        id: cart.items.map(item => item.productId)
      }
    });

    const cartItems = cart.items.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        ...item,
        productName: product?.productName,
        price: product?.price,
        image: product?.images[0]
      };
    });
    await cart.save();
    return {
      
      ...cart.toJSON(),
      items: cartItems
    };
  }
  static async updateCartItem(userId: string, productId: string, quantity: number) {
    try {
      console.log(`Finding cart for userId: ${userId}`);
      const cart = await Cart.findOne({ where: { userId } });
      if (!cart) {
        throw new Error("Cart not found");
      }
  
      console.log(`Cart found: ${JSON.stringify(cart)}`);
  
      // Check if the cart has items property and if it's an array
      if (!Array.isArray(cart.items)) {
        throw new Error("Invalid cart items format");
      }
  
      // Find the index of the product in the cart items
      const itemIndex = cart.items.findIndex(item => item.productId === productId);
      if (itemIndex === -1) {
        throw new Error("Product not found in cart");
      }
  
      console.log(`Product found in cart at index: ${itemIndex}`);
  
      // Update the quantity of the product
      cart.items[itemIndex].quantity = quantity;
  
      console.log(`Updated product quantity: ${JSON.stringify(cart.items[itemIndex])}`);
  
      // Recalculate the total
      const updatedItems = await Promise.all(cart.items.map(async item => {
        const product = await Product.findByPk(item.productId);
        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }
        return {
          productId: item.productId,
          quantity: item.quantity,
          productPrice: product.price,
          total: item.quantity * product.price
        };
      }));
  
      console.log(`Updated items with prices: ${JSON.stringify(updatedItems)}`);
  
      // Update the cart total and items
      cart.total = updatedItems.reduce((total, item) => total + item.total, 0);
      cart.items = updatedItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));
  
      console.log(`Recalculated cart total: ${cart.total}`);
  
      // Save the updated cart
      const updatedCart=await cart.save();
  
      console.log(`Cart saved successfully`,updatedCart.items);
  
      return updatedCart;
    } catch (error:any) {
      console.error("Error updating cart item:", error.message);
      throw error;
    }
  }
  
  

  static async clearCart(userId: string) {
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.items = [];
    cart.total = 0;
    await cart.save();

    return cart;
  }
}
