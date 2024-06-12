import { Request, Response } from "express";
import { isUserFound } from "../utils/userFound";
import { ProductService } from "../services/Product.services";
import { WishlistService } from "../services/wishlist.services";

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
  const wishlistExist = await WishlistService.getProductByid(productId);
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