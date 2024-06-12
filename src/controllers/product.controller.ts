import { Request, Response } from "express";
import { createProductAttributes } from "../types/product.types";
import { ProductService } from "../services/Product.services";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
import { CreateCollectionService } from "../services/collection.services";
import Product from "../database/models/Product.model";
import "../utils/cloudinary.utils";
import { Op } from "sequelize";

dotenv.config();

export const createProduct = async function (req: Request, res: Response) {
  try {
    const collection = await CreateCollectionService.getCollectionByid(
      req.params.collection_id
    );

    if (!collection) {
      return res.status(400).json({ message: "The collection doesn't exist" });
    }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length > 8 || files.length < 4) {
      return res.status(400).json({
        message: "Please upload at least 4 images and not exceeding 8",
      });
    }
    let imageUrls = [] as string[];
    let imagePublicId = [] as string[];
    await Promise.all(
      files.map(async (file) => {
        const result = await cloudinary.v2.uploader.upload(file.path);
        imageUrls.push(result.secure_url);
        imagePublicId.push(result.public_id);
        return { secure_url: result.secure_url, pubic_id: result.public_id };
      })
    );

    const product: createProductAttributes = {
      productName: req.body.productName,
      seller_id: req.user?.id,
      price: req.body.price,
      expireDate: req.body.expireDate,
      collection_id: req.params.collection_id,
      quantity: req.body.quantity,
      description: req.body.description,
      images: imageUrls,
      category: req.body.category,
    };

    const existingProduct = await Product.findOne({
      where: { productName: product.productName },
    });
    if (existingProduct) {
      return res.status(409).json({
        message: "Product exists, please update your stock",
      });
    }

    if (
      !product.collection_id ||
      !product.collection_id ||
      !product.description ||
      !product.expireDate ||
      !product.price ||
      !product.productName ||
      !product.quantity ||
      !product.seller_id
    ) {
      //delete images when there is an error
      imagePublicId.forEach(async (publicId) => {
        await cloudinary.v2.uploader.destroy(publicId);
      });

      return res
        .status(400)
        .json({ message: "Make sure you enter all required information" });
    }

    const createdProduct = await ProductService.createProduct(product);
    return res.status(200).json({
      message: "Product is created successfully",
      Product: createdProduct,
    });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

//search products

export const searchProducts = async (req: Request, res: Response) => {
  const { search, price_range, category } = req.query;

  const query: any = {
    where: {},
  };

  if (search) {
    query.where.productName = { [Op.like]: `%${search}%` };
  }

  if (price_range) {
    const [min, max] = (price_range as string).split(",").map(Number);
    query.where.price = { [Op.between]: [min, max] };
  }

  if (category) {
    query.where.category = category as string;
  }

  const products = await ProductService.getProducts(query);

  return res.status(200).json({ products });
};
