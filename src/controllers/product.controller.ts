import { Request, Response } from "express";
import { createProductAttributes } from "../types/product.types";
import { ProductService } from "../services/Product.services";
import cloudinary from "cloudinary";
import dotenv from "dotenv";

import { CreateCollectionService } from "../services/collection.services";
import Product from "../database/models/Product.model";
import "../utils/cloudinary.utils";
import { Op } from "sequelize";
import { notificationEventEmitter } from "../events/notificationEvents.event";

import { imageServices } from "../services/Image.service";

dotenv.config();
// dotenv.config();
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

    // Send notification
    notificationEventEmitter.emit("productCreated", product);

    return res.status(200).json({
      message: "Product is created successfully",
      Product: createdProduct,
    });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

export const getAvailableItems = async function (req: Request, res: Response) {
  const items = await ProductService.getAvailableItems();
  const user = req.user;
  if (!user) {
    return res.status(401).json({ status: 401, error: "Unauthorized access" });
  }
  return res.status(200).json({
    status: 200,
    message: "Items retrieved successfully",
    items: items,
  });
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

export const getAvailableProducts = async (req: Request, res: Response) => {
  try {
    const seller_id = req.params.seller_id;
    const products = await ProductService.getAvailableProductsBySeller(
      seller_id
    );

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ message: "No available products found for this seller." });
    }

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
export const updateProductAvailability = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;
    const { availability } = req.body;

    const product = await ProductService.getProductByid(id);

    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }

    product.availability = availability;

    await product.save();

    return res.status(200).json({
      status: "success",
      message: "Product availability updated successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    console.error("Error updating product availability:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while updating the product availability",
    });
  }
};
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.product_id;
    const product = await ProductService.getProductByid(productId);

    await ProductService.deleteProductById(productId);
    notificationEventEmitter.emit("productDeleted", product);
    return res.status(202).json({
      message: "Product deleted successfully",
      deletedProduct: product,
    });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};

export const updateProduct = async function (req: Request, res: Response) {
  const productId = req.params.product_id;
  const product = (await ProductService.getProductByid(productId)) as Product;
  const {
    productName,
    price,
    quantity,
    availabilty,
    expireDate,
    category,
    description,
  } = req.body;

  const updatedProduct = await product.update({
    productName: productName,
    description: description,
    price: price,
    quantity: quantity,
    availability: availabilty,
    expireDate: expireDate,
    category: category,
  });
  return res.status(200).json({
    message: "Product updated successfully",
    updatedProduct: updatedProduct,
  });
};
export const addImages = async function (req: Request, res: Response) {
  try {
    const productId = req.params.product_id;
    const product = (await ProductService.getProductByid(productId)) as Product;
    const files = req.files as Express.Multer.File[];

    if (product?.images.length + files.length > 8) {
      return res.status(400).json({ message: "Images can't exceed 8" });
    }
    if (!files) {
      return res.status(400).json({ message: "Add an image to continue" });
    }
    const imageUrls = await imageServices.uploadImages(files);
    let newImages = [...product.images];
    newImages.push(...imageUrls);
    const updatedProduct = await product.update({ images: newImages });
    await updatedProduct.save();
    return res.status(200).json({
      message: "Images added successfully",
      updatedproduct: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};

export async function updateImageByUrl(req: Request, res: Response) {
  try {
    const productId = req.params.product_id;
    const imageUrl = req.body.imageUrl as string;
    const product = (await ProductService.getProductByid(productId)) as Product;
    const files = req.files as Express.Multer.File[];

    if (!product.images.includes(imageUrl)) {
      res.status(400).json({ message: "The image doesn't exist" });
    }
    if (!files) {
      return res.status(400).json({ message: "Please upload new image" });
    }
    const imagePublicId = imageServices.obtainPublicId(imageUrl);
    await cloudinary.v2.uploader.destroy(imagePublicId);

    const imageUrls = await imageServices.uploadImages(files);
    const newImages = [...product?.images].filter((url) => url !== imageUrl);
    newImages.push(...imageUrls);

    const updatedProduct = await product?.update({ images: newImages });

    return res.status(200).json({
      message: "Images added successfully",
      updatedproduct: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
}

export async function UpdateAllImages(req: Request, res: Response) {
  try {
    const productId = req.params.product_id;
    const product = (await ProductService.getProductByid(productId)) as Product;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length > 8 || files.length < 4) {
      return res.status(400).json({
        message: "Please upload at least 4 images and not exceeding 8",
      });
    }

    await Promise.all(
      [...product.images].map(async (url) => {
        let public_id = imageServices.obtainPublicId(url);
        return await cloudinary.v2.uploader.destroy(public_id);
      })
    );

    const imageUrls = await imageServices.uploadImages(files);

    const updatedProduct = await product?.update({ images: [...imageUrls] });
    return res.status(200).json({
      message: "Images updated successfully",
      updatedproduct: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
}

export async function removeImage(req: Request, res: Response) {
  try {
    const productId = req.params.product_id;
    const product = (await ProductService.getProductByid(productId)) as Product;
    const imageUrl = req.body.imageUrl as string;
    const public_id = imageServices.obtainPublicId(imageUrl);

    if (!product.images.includes(imageUrl)) {
      return res.status(400).json({ message: "The image doesn't exist" });
    }

    if (product?.images.length === 4) {
      return res.status(400).json({
        message: "You can't delete an image because you have 4 images",
      });
    }

    await cloudinary.v2.uploader.destroy(public_id);

    const newImages = [...product.images.filter((image) => image != imageUrl)];

    const updatedProduct = await product?.update({ images: newImages });

    return res.status(200).json({
      message: "Images removed successfully",
      updatedproduct: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
}
export const viewProduct = async function (req: Request, res: Response) {
  const productId = req.params.product_id as string;
  const product = await ProductService.getProductByid(productId);

  if (!product)
    return res.status(400).json({ message: "Product doesn't exist" });

  if (product?.availability === true) {
    return res.status(200).json({
      message: "Product is available",
      product: product,
    });
  }
  return res.status(400).json({ message: "Product is not available" });
};
export const viewProductBySeller = async function (
  req: Request,
  res: Response
) {
  const productId = req.params.product_id as string;
  const product = await ProductService.getProductByid(productId);
  const seller_id = req.user.id;

  if (!product)
    return res.status(400).json({ message: "Product doesn't exist" });
  const collectionId = req.params.collection_id as string;
  const collection = await CreateCollectionService.getCollectionByid(
    collectionId
  );

  if (!collection)
    return res.status(400).json({ message: "Collection doesn't exist" });

  if (product?.collection_id !== collectionId) {
    return res
      .status(400)
      .json({ message: "The product doesn't exist in your collection" });
  }

  if (product?.seller_id !== seller_id)
    return res.status(400).json({ message: "You don't own the product" });

  return res.status(200).json({
    message: "Product found",
    product: product,
  });
};
