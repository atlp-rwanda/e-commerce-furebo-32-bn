
import Cart from "../database/models/cart.model";
import Product from "../database/models/Product.model";


export class CartService {
  static async createCart(userId: string) {
    return await Cart.create({ userId });
  }
  static async addItemToCart(userId: string, productId: string) {
    
    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      cart = await Cart.create({ userId });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    const itemIndex = cart.items.findIndex(item => item.productId === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      
      cart.items.push({ productId, quantity: 1 });
    }

    cart.total += product.price;
  
    const updatedCart = await cart.save();

    return updatedCart;
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
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      throw new Error("Cart not found");
    }
  
    // Find the item in the cart
    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    if (itemIndex === -1) {
      throw new Error("Product not found in cart");
    }
  
    // Update the quantity
    cart.items[itemIndex].quantity = quantity;
  
    // Recalculate total
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
  
    cart.total = updatedItems.reduce((total, item) => total + item.total, 0);
    cart.items = updatedItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }));
  
    await cart.save();
  
    return cart;
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
