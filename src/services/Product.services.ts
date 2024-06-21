import Product from "../database/models/Product.model";
import { createProductAttributes } from "../types/product.types";

export class ProductService {
  
  static async createProduct(product: createProductAttributes) {
    return await Product.create(product);
  }
  static async getProductByName(productName: string) {
    return await Product.findOne({ where: { productName: productName } });
  }

  static async getProductByid(id: string) {
    return await Product.findOne({ where: { id: id } });
  }
  static async getAvailableItems() {
    return await Product.findAll({ where: { availability: true } });
  }
  static async getProducts(query: any) {
    return await Product.findAll(query);
  }
  static async getProductById(productId: string) {
    return await Product.findByPk(productId);
  }

  static async getAvailableProductsBySeller(seller_id: string) {
    return await Product.findAll({
      where: {
        seller_id: seller_id,
        availability: true,
      },
    });
  }
  static async updateInventory(productId: string, quantity: number) {
    try {
      const product = await Product.findOne({ where: { id: productId } });
  
      if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
      }

      if (product.quantity < quantity) {
        throw new Error(`Insufficient inventory for product ID ${productId}`);
      }

      product.quantity -= quantity;
      
      await product.save();

      return product;
    } catch (error: any) {
      throw new Error(`Failed to update inventory: ${error.message}`);
    }
  }
  static async  deleteProductById(id:string){
    return await Product.destroy({where:{ id:id }})
  }
}
