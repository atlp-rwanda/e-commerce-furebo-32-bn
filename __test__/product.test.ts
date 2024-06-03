import request from "supertest";
import app from "../src/app";
import db from "../src/database/config/database.config";

let token: string;

describe("Product", () => {
  let sequelizeInstance: any;

  beforeAll(async () => {
    jest.setTimeout(60000);
    sequelizeInstance = await db();
    await sequelizeInstance.query(
      "TRUNCATE TABLE products RESTART IDENTITY CASCADE;"
    );
    await sequelizeInstance.query(
      "TRUNCATE TABLE users RESTART IDENTITY CASCADE;"
    );

    // Create a test admin user and get a token
    const sellerUser = {
      firstName: "Mugisha",
      lastName: "Emmanuel",
      email: "emmyzizo1@gmail.com",
      password: "Password@123",
      role: "seller",
      phone: "+250780060254",
    };
    const sellerRes = await request(app)
      .post("/api/users/signup")
      .send(sellerUser);
    token = sellerRes.body.token;
  });

  afterAll(async () => {
    if (sequelizeInstance) {
      await sequelizeInstance.close();
    }
  });

  describe("Create Product", () => {
    test("creates a product with valid data", async () => {
      const newProduct = {
        name: "Test Product",
        description: "This is a test product",
        price: 99.99,
        stock: 10,
        expireDate: "2024-12-31",
      };

      const res = await request(app)
        .post("/api/product/create")
        .set("Authorization", `Bearer ${token}`)
        .send(newProduct);

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Product created successfully");
      expect(res.body.data.product.name).toBe(newProduct.name);
    });

    test("fails to create a product with missing required fields", async () => {
      const newProduct = {
        description: "This is a test product",
        price: 99.99,
        stock: 10,
        expireDate: "2024-12-31",
      };

      const res = await request(app)
        .post("/api/product/create")
        .set("Authorization", `Bearer ${token}`)
        .send(newProduct);

      expect(res.statusCode).toBe(400);
      expect(res.body.data.message).toContain("Name is required");
    });
  });

  describe("Get All Products", () => {
    test("retrieves all products", async () => {
      const res = await request(app)
        .get("/api/product/all")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data.products)).toBe(true);
    });
  });

  describe("Update Product Details", () => {
    let productId: string;

    beforeAll(async () => {
      const newProduct = {
        name: "Test Product to Update",
        description: "This product will be updated",
        price: 49.99,
        stock: 5,
        expireDate: "2024-12-31",
      };

      const res = await request(app)
        .post("/api/product/create")
        .set("Authorization", `Bearer ${token}`)
        .send(newProduct);

      productId = res.body.data.product.id;
    });

    test("updates product details with valid data", async () => {
      const updatedProduct = {
        stock: 20,
        available: false,
        expireDate: "2025-12-31",
      };

      const res = await request(app)
        .patch(`/api/product/update/${productId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updatedProduct);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Product details updated successfully");
      expect(res.body.data.product.stock).toBe(updatedProduct.stock);
    });

    test("fails to update product details with invalid data", async () => {
      const updatedProduct = {
        stock: -10,
      };

      const res = await request(app)
        .patch(`/api/product/update/${productId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updatedProduct);

      expect(res.statusCode).toBe(400);
      expect(res.body.data.message).toContain(
        "Stock must be a positive integer"
      );
    });

    test("fails to update non-existing product", async () => {
      const updatedProduct = {
        stock: 20,
        available: true,
        expireDate: "2025-12-31",
      };

      const res = await request(app)
        .patch("/api/product/update/non-existing product")
        .set("Authorization", `Bearer ${token}`)
        .send(updatedProduct);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Product not found");
    });
  });
});
