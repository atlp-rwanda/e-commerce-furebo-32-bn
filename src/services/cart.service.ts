import Cart from "../database/models/cart.model";
import Product from "../database/models/Product.model";

export class CartService {
  static async getCartById(cartId: string): Promise<Cart | null> {
    try {
      const cart = await Cart.findByPk(cartId, {
        include: [{ model: Product, as: "products" }],
      });
      return cart;
    } catch (error) {
      throw new Error("Failed to fetch cart");
    }
  }

  static async updateCart(
    cartId: string,
    items: { productId: string; quantity: number }[]
  ): Promise<Cart> {
    const cart = await Cart.findByPk(cartId);
    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.items = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findByPk(item.productId);
        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }
        return {
          productId: item.productId,
          quantity: item.quantity,
          name: product.name,
          price: product.price,
          image: product.image,
          description: product.description,
        };
      })
    );

    cart.total = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    await cart.save();

    return cart;
  }

  static async createCart(
    userId: string,
    name: string,
    description: string
  ): Promise<Cart> {
    try {
      const cart = await Cart.create({ userId, name, description });
      return cart;
    } catch (error) {
      throw new Error("Failed to create cart");
    }
  }

  static async addItemToCart(
    cartId: string,
    productId: string,
    quantity: number,
    description: string
  ): Promise<Cart> {
    const cart = await Cart.findByPk(cartId);
    if (!cart) {
      throw new Error("Cart not found");
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    const existingItemIndex = cart.items.findIndex(
      (item: any) => item.productId === productId
    );
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        name: product.name,
        price: product.price,
        image: product.image,
        description,
      });
    }

    cart.total += product.price * quantity;
    await cart.save();

    return cart;
  }

  static async clearCart(cartId: string): Promise<void> {
    const cart = await Cart.findByPk(cartId);
    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.items = [];
    cart.total = 0;
    await cart.save();
  }

  static async deleteItemFromCart(
    cartId: string,
    productId: string
  ): Promise<Cart> {
    const cart = await this.getCartById(cartId);
    if (!cart) {
      throw new Error("Cart not found");
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );
    if (itemIndex > -1) {
      const product = await Product.findByPk(productId);
      if (!product) {
        throw new Error("Product not found");
      }
      cart.total -= cart.items[itemIndex].quantity * product.price;
      cart.items.splice(itemIndex, 1);
      await cart.save();
    }

    return cart;
  }

  static async getAllCarts(): Promise<Cart[]> {
    try {
      const carts = await Cart.findAll();
      return carts;
    } catch (error) {
      throw new Error("Failed to fetch carts");
    }
  }
}
