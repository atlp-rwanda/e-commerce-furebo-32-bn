import { NextFunction, Request, Response, /* NextFunction */} from 'express';
import * as controller from '../src/controllers/cart.controller';
import { CartService } from '../src/services/cart.services'; 
import { ProductService } from '../src/services/Product.services';
import {  validateAddItemToCart, validateUpdateCart } from '../src/validations/cart.validate'; 
import { createCart } from '../src/controllers/cart.controller';




jest.mock('../src/services/cart.services'); 
jest.mock('../src/services/Product.services'); 


describe('createCart', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      body: { name: 'Test Cart', description: 'Test Description' },
      user: { id: 'test_user_id' }, // Mock the user object to include id
    } as unknown as Request;

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  it('should create a new cart', async () => {
    const expectedCart = {
      id: 'test_cart_id',
      name: 'Test Cart',
      description: 'Test Description',
      userId: 'test_user_id',
      items: [],
      total: 0,
    };

    (CartService.createCart as jest.Mock).mockResolvedValue(expectedCart);

    await createCart(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Cart created successfully', cart: expectedCart });
  });

  it('should handle errors during cart creation', async () => {
    const errorMessage = 'Error creating cart';
    (CartService.createCart as jest.Mock).mockRejectedValue(new Error(errorMessage));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await createCart(req, res);

    expect(consoleSpy).toHaveBeenCalledWith('Error creating cart:', new Error(errorMessage));
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });

    consoleSpy.mockRestore();
  });
});


describe('addItemToCart', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      body: { cartId: 'test_cart_id', productId: 'test_product_id', quantity: 2 },
      user: { id: 'test_user_id' }
    } as unknown as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;
  });

  it('should add an item to the cart', async () => {
    const product = { name: 'Test Product', price: 10, image: 'test_image_url' };
    const cart = { id: 'test_cart_id', userId: 'test_user_id', items: [] };
    const expectedCart = { id: 'test_cart_id', items: [{ productId: 'test_product_id', productName: 'Test Product', price: 10, image: 'test_image_url', quantity: 2 }] };

    (ProductService.getProductById as jest.Mock).mockResolvedValue(product);
    (CartService.getCartById as jest.Mock).mockResolvedValue(cart);
    (CartService.addCartItem as jest.Mock).mockResolvedValue(undefined);
    (CartService.getPopulatedCart as jest.Mock).mockResolvedValue(expectedCart);

    await controller.addItemToCart(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Item added to cart successfully',
      cart: {
        id: expectedCart.id,
        items: expectedCart.items.map((item: any) => ({
          productId: item.productId,
          productName: item.productName,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          productDetails: item.productDetails
        }))
      }
    });
  });

  it('should handle errors during adding item to the cart', async () => {
    const errorMessage = 'Error adding item to cart';
    (ProductService.getProductById as jest.Mock).mockRejectedValue(new Error(errorMessage));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await controller.addItemToCart(req, res);

    expect(consoleSpy).toHaveBeenCalledWith('Error adding item to cart:', new Error(errorMessage));
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });

  it('should return 404 if the product is not found', async () => {
    (ProductService.getProductById as jest.Mock).mockResolvedValue(null);

    await controller.addItemToCart(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Product not found' });
  });


  it('should return 404 if the cart is not found', async () => {
    (ProductService.getProductById as jest.Mock).mockResolvedValue({ name: 'Test Product', price: 10, image: 'test_image_url' });
    (CartService.getCartById as jest.Mock).mockResolvedValue(null);

    await controller.addItemToCart(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Cart not found' });
  });

});

describe('viewCart', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = { params: { cartId: 'test_cart_id' }, user: { id: 'test_user_id' } } as unknown as Request;
    res = { 
      status: jest.fn().mockReturnThis(), 
      json: jest.fn()
    } as unknown as Response;
  });

  it('should retrieve the cart successfully', async () => {
    const cart = { id: 'test_cart_id', userId: 'test_user_id', items: [{ productId: 'test_product_id', quantity: 2, productName: 'Test Product',  price: 10, image: 'test_image_url'}] };
    const product = { name: 'Test Product', price: 10, image: 'test_image_url' };
    const expectedCart = {
      id: 'test_cart_id',
      items: [{
        id: 'test_product_id',
        productId: 'test_product_id',
        productName: 'Test Product',
        price: 10,
        image: 'test_image_url',
        quantity: 2,
        productDetails: { name: 'Test Product', price: 10, image: 'test_image_url' }
      }]
    };
    (CartService.getCartById as jest.Mock).mockResolvedValue(cart);
    (ProductService.getProductById as jest.Mock).mockResolvedValue(product);
  
    await controller.viewCart(req, res);
  
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Cart retrieved successfully',
      cart: {
        ...cart,
        items: expectedCart.items.map(item => ({
          id: item.id,
          productId: item.productId,
           productName: item.productName,
          price: item.price,
          image: item.image, 
          quantity: item.quantity,
          productDetails: item.productDetails
        }))
      }
    });
  });
  

  it('should handle errors during cart retrieval', async () => {
    const errorMessage = 'Error viewing cart';
    (CartService.getCartById as jest.Mock).mockRejectedValue(new Error(errorMessage));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await controller.viewCart(req, res);

    expect(consoleSpy).toHaveBeenCalledWith('Error viewing cart:', new Error(errorMessage));
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
  
  it('should return 404 error when cart does not exist', async () => {
    const errorMessage = 'Cart not found';
    (CartService.getCartById as jest.Mock).mockResolvedValue(null);

    await controller.viewCart(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });

  it('should return 404 error when cart exists but does not belong to user', async () => {
    const errorMessage = 'Cart not found';
    const cart = { id: 'test_cart_id', userId: 'another_user_id', items: [{ productId: 'test_product_id', quantity: 2, productName: 'Test Product',  price: 10, image: 'test_image_url'}] };
    (CartService.getCartById as jest.Mock).mockResolvedValue(cart);

    await controller.viewCart(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });

});


describe('updateCart', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    
    req = {
      params: { cartId: 'test_cart_id' },
      body: { items: [{ productId: 'test_product_id', quantity: 2 }] },
      user: { id: 'test_user_id' }
    } as unknown as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;
  });

  it('should update the cart successfully', async () => {
    const updatedCart = { id: 'test_cart_id', items: [{ productId: 'test_product_id', quantity: 2 }] };
    const populatedCart = { id: 'test_cart_id', items: [{ id: 'test_product_id', productId: 'test_product_id', quantity: 2 }] };
    (CartService.updateCart as jest.Mock).mockResolvedValue(updatedCart);
    (CartService.getPopulatedCart as jest.Mock).mockResolvedValue(populatedCart);

    await controller.updateCart(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Cart updated successfully', cart: populatedCart });
  });

  it('should handle errors during cart update', async () => {
    const errorMessage = 'Error updating cart';
    (CartService.updateCart as jest.Mock).mockRejectedValue(new Error(errorMessage));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await controller.updateCart(req, res);

    expect(consoleSpy).toHaveBeenCalledWith('Error updating cart:', new Error(errorMessage));
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });

 
  it('should return 400 error for invalid quantity', async () => {
  
    req.body.items.push({ productId: 'invalid_product_id', quantity: -1 });

    await controller.updateCart(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Bad Request',
      message: 'Quantity must be a positive integer'
    });
  });

});



describe('clearCart', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = { params: { cartId: 'test_cart_id' }, user: { id: 'test_user_id' } } as unknown as Request;
    res = { 
      status: jest.fn().mockReturnThis(), 
      json: jest.fn()
    } as unknown as Response;
  });

  it('should clear the cart successfully', async () => {
    (CartService.clearCart as jest.Mock).mockResolvedValue(true);

    await controller.clearCart(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Cart cleared successfully' });
  });

  it('should handle errors during cart not found', async () => {
    (CartService.clearCart as jest.Mock).mockResolvedValue(false);
    await controller.clearCart(req, res);

expect(res.status).toHaveBeenCalledWith(404);
expect(res.json).toHaveBeenCalledWith({ message: 'Cart not found' });
});
it('should handle errors during cart clearing', async () => {
  const errorMessage = 'Error clearing cart';
  (CartService.clearCart as jest.Mock).mockRejectedValue(new Error(errorMessage));
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  await controller.clearCart(req, res);

expect(consoleSpy).toHaveBeenCalledWith('Error clearing cart:', new Error(errorMessage));
expect(res.status).toHaveBeenCalledWith(500);
expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
});
});



type MockRequestBody = {
  [key: string]: any;
};

// Mocking Request, Response, NextFunction
const mockRequest = (body: MockRequestBody): Request => {
  const req = {} as Request;
  req.body = body;
  return req;
};
const mockResponse = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

const mockNext: NextFunction = jest.fn();


  describe('validateAddItemToCart', () => {
    it('should pass validation for a valid add item to cart request', async () => {
      const req = mockRequest({
        cartId: '123e4567-e89b-12d3-a456-426614174000', 
        productId: '223e4567-e89b-12d3-a456-426614174000',
        quantity: 2,
      });
      const res = mockResponse();

      await validateAddItemToCart(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
   
  
  });

  describe('validateUpdateCart', () => {
    it('should pass validation for a valid update cart request', async () => {
      const req = mockRequest({
        items: [
          {
            productId: '223e4567-e89b-12d3-a456-426614174000',
            quantity: 3,
          },
        ],
      });
      const res = mockResponse();

      await validateUpdateCart(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
    
  });

