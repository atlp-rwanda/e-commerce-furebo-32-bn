import { Request, Response } from "express";
import { ProductService } from "../services/Product.services";
import { isUserFound } from "../utils/userFound";
import { WishlistService } from "../services/wishlist.services";
import User from "../database/models/user.model";
import Product from "../database/models/Product.model";
import Wishlist from "../database/models/wishlist.model";

export const addToWishlist = async (req: Request, res: Response) => {
  const productId = req.params.productId;
  const userId = req.user.id;
  const productExist = await ProductService.getProductByid(productId);
  if (!productExist) {
    res.status(404).json({ message: "Product not found" });
  }
  if (await isUserFound(userId)) {
    return res.status(400).json({ message: "User not found" });
  }
  const wishlistExist = await WishlistService.getProductByid(productId,userId);
  console.log(wishlistExist);
  
  if (wishlistExist) {
    return res.status(200).json({ message: "Wishlist already exists" });
  }
  const wish = await WishlistService.createWishlist(productId, userId);
  res.status(200).json({
    status: "success",
    message: "Product added to wishlist",
    data: {
      wish,
    },
  });
};

export const deleteUserWishes = async (req: Request, res: Response) => {
  const user = req.user;
  const userId = user?.id;
  if (userId != null) {
    await WishlistService.deleteWishes(userId);
    res.status(200).send({ message: "Product wishes Deleted successfully" });
  }
};

export const getUserWishes = async (req: Request, res: Response) => {
  const user: User = req.user;
  const userId: string = user.id;
  let wishesData=[];

  if (user.role == "buyer") {
    const wishes: any = await WishlistService.getUserWishes(userId);
    const productIds = wishes.map((wish: any) => wish.dataValues.productId);

    const products = await Product.findAll({
      where: {
        id: productIds,
      },
    });


    console.log(res);

    const productMap = products.reduce((map: any, product: any) => {
      map[product.dataValues.id] = product;
      return map;
    }, {});

    wishesData = wishes.map((wish: any) => {
      const { productId, userId, updatedAt, ...wishData } = wish.dataValues;
      const product = productMap[productId];
      return { ...wishData, product: product.dataValues };
    });

    console.log(wishesData);
    res.status(200).send({
      message: "Your products wish list",
      data: wishesData
    });
  }
  else if (user.role == "seller") {
    const productsInWishes: any = [];

    const sellerProducts = await Product.findAll({
      where: { seller_id: userId }
    });

    const sellProductsIds = sellerProducts.map(
      (product: any) => product.dataValues.id
    );

    const sellerProductWishes = await Wishlist.findAll({
      where: { productId: sellProductsIds }
    });

    for (const wish of sellerProductWishes) {
      sellerProducts.map((product) => {
        if (wish.dataValues.productId == product.dataValues.id) {
          productsInWishes.push({
            ...wish.dataValues,
            product: product.dataValues
          });
        }
      });
    }
    res.status(200).send({
      message: "your products that are being wished",
      data: productsInWishes
    });
  }
};

export const deleteItemFromWishlist = async (req: Request, res: Response) => {
  const productId = req.params.productId;
  const userId = req.user.id;
  const productExist = await ProductService.getProductByid(productId);
  if (!productExist) {
    res.status(404).json({ message: "Product not found" });
  }
  if (await isUserFound(userId)) {
    return res.status(400).json({ message: "User not found" });
  }
  const wishlistExist = await WishlistService.getProductByid(productId,userId);
  if (!wishlistExist) {
    return res.status(404).json({ message: "Wishlist not found" });
  }
  await WishlistService.deleteWish(productId, userId);
  res.status(200).send({ message: "Product deleted from wishlist" });
};