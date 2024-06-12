import { Request, Response } from "express";
import { ProductService } from "../src/services/Product.services";
import { addToWishlist } from "../src/controllers/wishlist.controller";
import { isUserFound } from "../src/utils/userFound";
import { WishlistService } from "../src/services/wishlist.services";
import request from 'supertest';
import app from "../src/app";

// Mock the dependencies
jest.mock("../src/services/Product.services");
jest.mock("../src/services/wishlist.services");
jest.mock("../src/utils/userFound");

describe("addToWishlist", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    req = {
      params: {
        productId: "123",
      },
      user: {
        id: "456",
      },
    };

    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({
      json: jsonMock,
    })) as jest.Mock;

    res = {
      status: statusMock,
    };

    jest.clearAllMocks();
  });

  test("should return 404 if product not found", async () => {
    (ProductService.getProductByid as jest.Mock).mockResolvedValue(null);

    await addToWishlist(req as Request, res as Response);

    expect(ProductService.getProductByid).toHaveBeenCalledWith("123");
    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ message: "Product not found" });
  });

  test("should return 400 if user not found", async () => {
    (ProductService.getProductByid as jest.Mock).mockResolvedValue({});
    (isUserFound as jest.Mock).mockResolvedValue(true);

    await addToWishlist(req as Request, res as Response);

    expect(ProductService.getProductByid).toHaveBeenCalledWith("123");
    expect(isUserFound).toHaveBeenCalledWith("456");
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ message: "User not found" });
  });

  test("Should return status code 401 if user is not logged in", async () => {
    const productId="mcslmxlalamc";
    const res = await request(app)
      .post(`/api/wishlist/${productId}`)
      .set("Authorization", "");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Authorization header missing");
  });

  test("should return 200 if wishlist already exists", async () => {
    (ProductService.getProductByid as jest.Mock).mockResolvedValue({});
    (isUserFound as jest.Mock).mockResolvedValue(false);
    (WishlistService.getProductByid as jest.Mock).mockResolvedValue({});

    await addToWishlist(req as Request, res as Response);

    expect(ProductService.getProductByid).toHaveBeenCalledWith("123");
    expect(isUserFound).toHaveBeenCalledWith("456");
    expect(WishlistService.getProductByid).toHaveBeenCalledWith("123");
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({ message: "Wishlist already exists" });
  });

  test("should add product to wishlist successfully", async () => {
    (ProductService.getProductByid as jest.Mock).mockResolvedValue({});
    (isUserFound as jest.Mock).mockResolvedValue(false);
    (WishlistService.getProductByid as jest.Mock).mockResolvedValue(null);
    (WishlistService.createWishlist as jest.Mock).mockResolvedValue({ id: "789" });

    await addToWishlist(req as Request, res as Response);

    expect(ProductService.getProductByid).toHaveBeenCalledWith("123");
    expect(isUserFound).toHaveBeenCalledWith("456");
    expect(WishlistService.getProductByid).toHaveBeenCalledWith("123");
    expect(WishlistService.createWishlist).toHaveBeenCalledWith("123", "456");
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      status: "success",
      message: "Product added to wishlist",
      data: {
        wish: { id: "789" },
      },
    });
  });
});
