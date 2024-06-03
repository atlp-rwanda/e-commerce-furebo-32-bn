import Product from "../database/models/product.model";
import {ProductCreationAttributes} from "../types/product.types";

export class ProductService {
  static async createProduct(
    productData: ProductCreationAttributes
  ): Promise<Product> {
    return await Product.create(productData);
  }

  static async getProductById(id: string): Promise<Product | null> {
    return await Product.findByPk(id);
  }

  static async getAllProducts(): Promise<Product[]> {
    return await Product.findAll();
  }
}