import { CartService } from "../src/services/cart.services";

import Cart from "../src/database/models/cart.model";
import Product from "../src/database/models/Product.model";
 
jest.mock('../src/database/models/cart.model');
jest.mock('../src/database/models/Product.model');

describe('CartService.createCart', () => {
  it('should create a new cart for the user', async () => {
    const mockCart = { id: 'cartId', userId: 'testUserId' };
    (Cart.create as jest.Mock).mockResolvedValue(mockCart);

    const result = await CartService.createCart('testUserId');

    expect(Cart.create).toHaveBeenCalledWith({ userId: 'testUserId' });
    expect(result).toEqual(mockCart);
  });
});

describe('CartService.addItemToCart', () => {
  it('should add an item to the existing cart', async () => {
    const mockCart = {
      id: 'cartId',
      userId: 'testUserId',
      items: [{ productId: 'productId', quantity: 1 }],
      total: 10,
      save: jest.fn().mockResolvedValue({
        id: 'cartId',
        userId: 'testUserId',
        items: [{ productId: 'productId', quantity: 2 }],
        total: 20,
      }),
    };

    const mockProduct = { id: 'productId', productName: 'Product', price: 10, images: ['image.jpg'] };

    (Cart.findOne as jest.Mock).mockResolvedValue(mockCart);
    (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);

    const result = await CartService.addItemToCart('testUserId', 'productId');

    expect(Cart.findOne).toHaveBeenCalledWith({ where: { userId: 'testUserId' } });
    expect(Product.findByPk).toHaveBeenCalledWith('productId');
    expect(mockCart.save).toHaveBeenCalled();
    expect(result).toEqual({
      id: 'cartId',
      userId: 'testUserId',
      items: [{ productId: 'productId', quantity: 2 }],
      total: 20,
    });
  });

  it('should create a new cart if none exists and add the item', async () => {
    const mockCart = {
      id: 'cartId',
      userId: 'testUserId',
      items: [{ productId: 'productId', quantity: 1 }],
      total: 10,
      save: jest.fn().mockResolvedValue({
        id: 'cartId',
        userId: 'testUserId',
        items: [{ productId: 'productId', quantity: 1 }],
        total: 10,
      }),
    };

    const mockProduct = { id: 'productId', productName: 'Product', price: 10, images: ['image.jpg'] };

    (Cart.findOne as jest.Mock).mockResolvedValue(null);
    (Cart.create as jest.Mock).mockResolvedValue(mockCart);
    (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);

    const result = await CartService.addItemToCart('testUserId', 'productId');

    expect(Cart.findOne).toHaveBeenCalledWith({ where: { userId: 'testUserId' } });
    expect(Cart.create).toHaveBeenCalledWith({ userId: 'testUserId' });
    expect(Product.findByPk).toHaveBeenCalledWith('productId');
    expect(mockCart.save).toHaveBeenCalled();
    expect(result).toEqual({
      id: 'cartId',
      userId: 'testUserId',
      items: [{ productId: 'productId', quantity: 1 }],
      total: 10,
    });
  });

  it('should throw an error if the product is not found', async () => {
    const mockCart = {
      id: 'cartId',
      userId: 'testUserId',
      items: [],
      total: 0,
      save: jest.fn(),
    };

    (Cart.findOne as jest.Mock).mockResolvedValue(mockCart);
    (Product.findByPk as jest.Mock).mockResolvedValue(null);

    await expect(CartService.addItemToCart('testUserId', 'productId')).rejects.toThrow('Product not found');

    expect(Cart.findOne).toHaveBeenCalledWith({ where: { userId: 'testUserId' } });
    expect(Product.findByPk).toHaveBeenCalledWith('productId');
  });
  it('should add a new item to the cart if the item does not exist', async () => {
    const mockCart = {
      id: 'cartId',
      userId: 'testUserId',
      items: [],
      total: 0,
      save: jest.fn().mockResolvedValue({
        id: 'cartId',
        userId: 'testUserId',
        items: [{ productId: 'productId', quantity: 1 }],
        total: 10,
      }),
    };

    const mockProduct = { id: 'productId', productName: 'Product', price: 10, images: ['image.jpg'] };

    (Cart.findOne as jest.Mock).mockResolvedValue(mockCart);
    (Cart.create as jest.Mock).mockResolvedValue(mockCart);
    (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);

    const result = await CartService.addItemToCart('testUserId', 'productId');

    expect(Cart.findOne).toHaveBeenCalledWith({ where: { userId: 'testUserId' } });
    expect(Product.findByPk).toHaveBeenCalledWith('productId');
    expect(mockCart.save).toHaveBeenCalled();
    expect(result).toEqual({
      id: 'cartId',
      userId: 'testUserId',
      items: [{ productId: 'productId', quantity: 1 }],
      total: 10,
    });
  });
});

describe('CartService.viewCart', () => {
  it('should return the cart with item details', async () => {
    const mockCart = {
      id: 'cartId',
      userId: 'testUserId',
      items: [{ productId: 'productId', quantity: 1 }],
      total: 10,
      toJSON: jest.fn().mockReturnValue({
        id: 'cartId',
        userId: 'testUserId',
        items: [{ productId: 'productId', quantity: 1 }],
        total: 10,
      }),
      save: jest.fn(),
    };

    const mockProduct = { id: 'productId', productName: 'Product', price: 10, images: ['image.jpg'] };

    (Cart.findOne as jest.Mock).mockResolvedValue(mockCart);
    (Product.findAll as jest.Mock).mockResolvedValue([mockProduct]);

    const result = await CartService.viewCart('testUserId');

    expect(Cart.findOne).toHaveBeenCalledWith({ where: { userId: 'testUserId' } });
    expect(Product.findAll).toHaveBeenCalledWith({ where: { id: ['productId'] } });
    expect(result).toEqual({
      id: 'cartId',
      userId: 'testUserId',
      items: [
        {
          productId: 'productId',
          quantity: 1,
          productName: 'Product',
          price: 10,
          image: 'image.jpg',
        },
      ],
      total: 10,
    });
  });

 
 
  it('should return the cart without item details if the cart is empty', async () => {
    const mockCart = {
      id: 'cartId',
      userId: 'testUserId',
      items: [],
      total: 0,
      toJSON: jest.fn().mockReturnValue({
        id: 'cartId',
        userId: 'testUserId',
        items: [],
        total: 0,
      }),
      save: jest.fn(),
    };

    (Cart.findOne as jest.Mock).mockResolvedValue(mockCart);

    const result = await CartService.viewCart('testUserId');

    expect(Cart.findOne).toHaveBeenCalledWith({ where: { userId: 'testUserId' } });
    expect(result).toEqual({
      id: 'cartId',
      userId: 'testUserId',
      items: [],
      total: 0,
    });
  });


  it('should throw an error if the cart is not found', async () => {
    (Cart.findOne as jest.Mock).mockResolvedValue(null);

    await expect(CartService.viewCart('testUserId')).rejects.toThrow('Cart not found');

    expect(Cart.findOne).toHaveBeenCalledWith({ where: { userId: 'testUserId' } });
  });
});
describe('CartService.updateCartItem', () => {
  it('should update the quantity of an existing item in the cart', async () => {
    const mockCart = {
      id: 'cartId',
      userId: 'testUserId',
      items: [{ productId: 'productId', quantity: 1 }],
      total: 10,
      save: jest.fn().mockResolvedValue({
        id: 'cartId',
        userId: 'testUserId',
        items: [{ productId: 'productId', quantity: 2 }],
        total: 20,
      }),
    };
    const mockProduct = { id: 'productId', price: 10 };

    (Cart.findOne as jest.Mock).mockResolvedValue(mockCart);
    (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);

    const result = await CartService.updateCartItem('testUserId', 'productId', 2);

    expect(Cart.findOne).toHaveBeenCalledWith({ where: { userId: 'testUserId' } });
    expect(Product.findByPk).toHaveBeenCalledWith('productId');
    expect(mockCart.save).toHaveBeenCalled();

    // Remove the save method before checking equality
    const resultWithoutSave = { ...result, save: undefined };
    expect(resultWithoutSave).toEqual({
      id: 'cartId',
      userId: 'testUserId',
      items: [{ productId: 'productId', quantity: 2 }],
      total: 20,
    });
  });

  it('should throw an error if the cart is not found', async () => {
    (Cart.findOne as jest.Mock).mockResolvedValue(null);

    await expect(CartService.updateCartItem('testUserId', 'productId', 2)).rejects.toThrow('Cart not found');

    expect(Cart.findOne).toHaveBeenCalledWith({ where: { userId: 'testUserId' } });
  });

  it('should throw an error if the product is not in the cart', async () => {
    const mockCart = {
      id: 'cartId',
      userId: 'testUserId',
      items: [],
      total: 0,
    };

    (Cart.findOne as jest.Mock).mockResolvedValue(mockCart);

    await expect(CartService.updateCartItem('testUserId', 'productId', 2)).rejects.toThrow('Product not found in cart');

    expect(Cart.findOne).toHaveBeenCalledWith({ where: { userId: 'testUserId' } });
  });

  it('should throw an error if the product is not found in the database', async () => {
    const mockCart = {
      id: 'cartId',
      userId: 'testUserId',
      items: [{ productId: 'productId', quantity: 1 }],
      total: 10,
    };

    (Cart.findOne as jest.Mock).mockResolvedValue(mockCart);
    (Product.findByPk as jest.Mock).mockResolvedValue(null);

    await expect(CartService.updateCartItem('testUserId', 'productId', 2)).rejects.toThrow('Product with ID productId not found');

    expect(Cart.findOne).toHaveBeenCalledWith({ where: { userId: 'testUserId' } });
    expect(Product.findByPk).toHaveBeenCalledWith('productId');
  });
});

describe('CartService.clearCart', () => {
  it('should clear the cart', async () => {
    const mockCart = { 
      id: 'cartId', 
      userId: 'testUserId', 
      items: [], 
      total: 0,
      save: jest.fn().mockResolvedValue(true) 
    };

    (Cart.findOne as jest.Mock).mockResolvedValue(mockCart);

    const result = await CartService.clearCart('testUserId');

    expect(Cart.findOne).toHaveBeenCalledWith({ where: { userId: 'testUserId' } });
    expect(mockCart.save).toHaveBeenCalled();
    expect(result).toEqual(mockCart);
  });
  it('should throw an error if the cart is not found', async () => {
    (Cart.findOne as jest.Mock).mockResolvedValue(null);

    await expect(CartService.clearCart('testUserId')).rejects.toThrow('Cart not found');

    expect(Cart.findOne).toHaveBeenCalledWith({ where: { userId: 'testUserId' } });
  });
});
