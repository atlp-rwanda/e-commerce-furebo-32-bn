import { Request, Response } from "express";
import { ProductService } from "../src/services/Product.services";
import { addToWishlist, deleteUserWishes, getUserWishes } from "../src/controllers/wishlist.controller";
import { isUserFound } from "../src/utils/userFound";
import { WishlistService } from "../src/services/wishlist.services";
import Product from "../src/database/models/Product.model";
import request from 'supertest';
import app from "../src/app";

// Mock the dependencies
jest.mock("../src/services/Product.services");
jest.mock("../src/services/wishlist.services");
jest.mock("../src/utils/userFound");
jest.mock("../src/database/models/Product.model");
jest.mock("../src/database/models/wishlist.model");

const setupMocks = () => {
  const req: Partial<Request> = {
    user: { id: "456", role: "buyer" },
    params: { productId: "123" },
  };

  const jsonMock = jest.fn();
  const sendMock = jest.fn();
  const statusMock = jest.fn(() => ({
    json: jsonMock,
    send: sendMock,
  })) as jest.Mock;

  const res: Partial<Response> = { status: statusMock };

  return { req, res, jsonMock, sendMock, statusMock };
};

describe("Wishlist Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addToWishlist", () => {
    test("should return 404 if product not found", async () => {
      const { req, res, statusMock, jsonMock } = setupMocks();
      (ProductService.getProductByid as jest.Mock).mockResolvedValue(null);

      await addToWishlist(req as Request, res as Response);

      expect(ProductService.getProductByid).toHaveBeenCalledWith("123");
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Product not found" });
    });

    test("should return 400 if user not found", async () => {
      const { req, res, statusMock, jsonMock } = setupMocks();
      (ProductService.getProductByid as jest.Mock).mockResolvedValue({});
      (isUserFound as jest.Mock).mockResolvedValue(true);

      await addToWishlist(req as Request, res as Response);

      expect(ProductService.getProductByid).toHaveBeenCalledWith("123");
      expect(isUserFound).toHaveBeenCalledWith("456");
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: "User not found" });
    });

    test("should return status code 401 if user is not logged in", async () => {
      const productId = "mcslmxlalamc";
      const res = await request(app).post(`/api/wishlist/${productId}`).set("Authorization", "");

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Authorization header missing");
    });

    test("should return 200 if wishlist already exists", async () => {
      const { req, res, statusMock, jsonMock } = setupMocks();
      (ProductService.getProductByid as jest.Mock).mockResolvedValue({});
      (isUserFound as jest.Mock).mockResolvedValue(false);
      (WishlistService.getProductByid as jest.Mock).mockResolvedValue({});

      await addToWishlist(req as Request, res as Response);

      expect(ProductService.getProductByid).toHaveBeenCalledWith("123");
      expect(isUserFound).toHaveBeenCalledWith("456");
      expect(WishlistService.getProductByid).toHaveBeenCalledWith("123", "456");
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Wishlist already exists" });
    });

    test("should add product to wishlist successfully", async () => {
      const { req, res, statusMock, jsonMock } = setupMocks();
      (ProductService.getProductByid as jest.Mock).mockResolvedValue({});
      (isUserFound as jest.Mock).mockResolvedValue(false);
      (WishlistService.getProductByid as jest.Mock).mockResolvedValue(null);
      (WishlistService.createWishlist as jest.Mock).mockResolvedValue({ id: "789" });

      await addToWishlist(req as Request, res as Response);

      expect(ProductService.getProductByid).toHaveBeenCalledWith("123");
      expect(isUserFound).toHaveBeenCalledWith("456");
      expect(WishlistService.getProductByid).toHaveBeenCalledWith("123", "456");
      expect(WishlistService.createWishlist).toHaveBeenCalledWith("123", "456");
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        status: "success",
        message: "Product added to wishlist",
        data: { wish: { id: "789" } },
      });
    });
  });

  describe("deleteUserWishes", () => {
    test("should not call deleteWishes and not return 200 if user ID is not present", async () => {
      const { req, res, statusMock, sendMock } = setupMocks();
      req.user = null;

      await deleteUserWishes(req as Request, res as Response);

      expect(WishlistService.deleteWishes).not.toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
      expect(sendMock).not.toHaveBeenCalled();
    });
  });

  describe("getUserWishes", () => {
    test("should return user wish list", async () => {
      const { req, res, statusMock, sendMock } = setupMocks();
      req.user.role = "buyer";

      const wishes = [
        { dataValues: { productId: "101", userId: "456", updatedAt: new Date() } },
      ];
      const products = [
        { dataValues: { id: "101", name: "Product 101" } },
      ];

      (WishlistService.getUserWishes as jest.Mock).mockResolvedValue(wishes);
      (Product.findAll as jest.Mock).mockResolvedValue(products);

      await getUserWishes(req as Request, res as Response);

      expect(WishlistService.getUserWishes).toHaveBeenCalledWith("456");
      expect(Product.findAll).toHaveBeenCalledWith({ where: { id: ["101"] } });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(sendMock).toHaveBeenCalledWith({
        message: "Your products wish list",
        data: [
          {
            product: { id: "101", name: "Product 101" },
          },
        ],
      });
    });
  });
});
