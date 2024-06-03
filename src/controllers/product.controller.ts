import { Request, Response } from "express";
import { ProductCreationAttributes } from "../types/product.types";
import { ProductService } from "../services/product.services";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, stock, expireDate } = req.body;

    const product: ProductCreationAttributes = {
      name,
      description,
      price,
      stock,
      available: true,
      expireDate,
    };

    const newProduct = await ProductService.createProduct(product);

    return res.status(201).json({
      status: "success",
      message: "Product created successfully",
      data: {
        product: newProduct,
      },
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while creating the product",
    });
  }
};

export const getAllProducts = async (_: Request, res: Response) => {
  try {
    const products = await ProductService.getAllProducts();

    return res.status(200).json({
      status: "success",
      data: {
        products,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while fetching products",
    });
  }
};

export const updateProductDetails = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const available = req.body.available;
    const {stock, expireDate } = req.body;

    const product = await ProductService.getProductById(id);

    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    };

    product.stock = stock;
    product.available = available;
    product.expireDate = expireDate;

    await product.save();

    return res.status(200).json({
      status: "success",
      message: "Product details updated successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    console.error("Error updating product details:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while updating the product details",
    });
  }
};

