import { CartController } from "../src/controllers/cart.controller";
import { CartService } from "../src/services/cart.services";
import { Request, Response } from "express";


jest.mock("../src/services/cart.services");
/* jest.mock("../src/database/models/cart.model");
jest.mock("../src/database/models/Product.model") */;

describe("CartController and CartService", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = { user: { id: "testUserId" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // CartController Tests

  describe("CartController.createCart", () => {
    it("should create a new cart for the user", async () => {
      const mockCart = { id: "cartId", items: [] };
      (CartService.createCart as jest.Mock).mockResolvedValue(mockCart);

      await CartController.createCart(req as Request, res as Response);

      expect(CartService.createCart).toHaveBeenCalledWith("testUserId");
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Cart created successfully",
        cartId: mockCart.id,
        items: mockCart.items
      });
    });

    it("should return 500 if there is an error", async () => {
      (CartService.createCart as jest.Mock).mockRejectedValue(new Error("Error"));

      await CartController.createCart(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Error" });
    });
  });

  describe("CartController.addItemToCart", () => {
    it("should add an item to the cart", async () => {
      const mockCart = { id: "cartId", items: [{ productId: "productId", quantity: 1 }] };
      (CartService.addItemToCart as jest.Mock).mockResolvedValue(mockCart);

      req.params = { productId: "productId" };
      await CartController.addItemToCart(req as Request, res as Response);

      expect(CartService.addItemToCart).toHaveBeenCalledWith("testUserId", "productId");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Item added to cart successfully",
        cart: mockCart
      });
    });

    it("should return 500 if there is an error", async () => {
      (CartService.addItemToCart as jest.Mock).mockRejectedValue(new Error("Error"));

      req.params = { productId: "productId" };
      await CartController.addItemToCart(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Error" });
    });
  });

  describe("CartController.viewCart", () => {
    it("should return the cart", async () => {
      const mockCart = { id: "cartId", items: [] };
      (CartService.viewCart as jest.Mock).mockResolvedValue(mockCart);

      await CartController.viewCart(req as Request, res as Response);

      expect(CartService.viewCart).toHaveBeenCalledWith("testUserId");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCart);
    });

    it("should return 500 if there is an error", async () => {
      (CartService.viewCart as jest.Mock).mockRejectedValue(new Error("Error"));

      await CartController.viewCart(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Error" });
    });
  });

  describe("CartController.updateCartItem", () => {
    it("should update the cart item quantity", async () => {
      const mockCart = { id: "cartId", items: [{ productId: "productId", quantity: 2 }] };
      (CartService.updateCartItem as jest.Mock).mockResolvedValue(mockCart);

      req.params = { productId: "productId" };
      req.body = { quantity: 2 };
      await CartController.updateCartItem(req as Request, res as Response);

      expect(CartService.updateCartItem).toHaveBeenCalledWith("testUserId", "productId", 2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Cart updated successfully",
        cart: mockCart
      });
    });

    it("should return 500 if there is an error", async () => {
      (CartService.updateCartItem as jest.Mock).mockRejectedValue(new Error("Error"));
    
      req.params = { productId: "productId" };
      req.body = { quantity: 2 };
      await CartController.updateCartItem(req as Request, res as Response);
    
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" }); 
    });
    it("should return 400 if quantity is invalid", async () => {
      req.body = { quantity: "invalid" };
      await CartController.updateCartItem(req as Request, res as Response);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid quantity" });
    });
    
    it("should return 404 if cart or product is not found", async () => {
      (CartService.updateCartItem as jest.Mock).mockRejectedValue(new Error("Cart not found"));
      req.params = { productId: "productId" };
      req.body = { quantity: 2 };
      await CartController.updateCartItem(req as Request, res as Response);
    
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Cart not found" });
    });
    
    
  });

  describe("CartController.clearCart", () => {
    it("should clear the cart", async () => {
      const mockCart = { id: "cartId", items: [], total: 0 };
      (CartService.clearCart as jest.Mock).mockResolvedValue(mockCart);

      await CartController.clearCart(req as Request, res as Response);

      expect(CartService.clearCart).toHaveBeenCalledWith("testUserId");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Cart cleared successfully",
        cart: mockCart
      });
    });

    it("should return 500 if there is an error", async () => {
      (CartService.clearCart as jest.Mock).mockRejectedValue(new Error("Error"));

      await CartController.clearCart(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Error" });
    });
  });
});
 
  
  
  