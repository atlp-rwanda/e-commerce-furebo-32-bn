import Wishlist from "../database/models/wishlist.model";

export class WishlistService {
  static async createWishlist(productId: string, userId: string) {
    return await Wishlist.create({ productId, userId });
  }
  static async getProductByid(productId: string) {
    return await Wishlist.findOne({ where: { productId: productId } });
  }
}
