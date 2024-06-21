import Wishlist from "../database/models/wishlist.model";


export class WishlistService {
  static async createWishlist(productId: string, userId: string) {
    return await Wishlist.create({ productId, userId });
  }
  static async getProductByid(productId: string,userId:string) {
    return await Wishlist.findOne({ where: { productId: productId ,userId:userId} });
  }
  static async deleteWishes(userId: string) {
    return await Wishlist.destroy({ where: { userId } });
  }
  static async getUserWishes(userId: string) {
    return await Wishlist.findAll({ where: { userId } });
  }
}