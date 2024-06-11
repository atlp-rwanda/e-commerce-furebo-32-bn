import Product from "../database/models/Product.model";
import { createProductAttributes } from "../types/product.types";

export class ProductService {
  static getProductById: any;
  static async createProduct(product: createProductAttributes) {
    return await Product.create(product);
  }
  static async getProductByName(productName:string) {
    return  await Product.findOne({ where: { productName: productName} });
  }

  static async getProductByid(id:string) {
    return await Product.findOne({ where: { id: id } });
  }
}