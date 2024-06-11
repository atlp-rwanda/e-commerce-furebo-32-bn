import { ProductAttributes } from "./product.types";

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
  Product: ProductAttributes; 
}

export interface createCartAttributes {
  userId: string;
  productId: string;
  quantity: number;
}

export interface updateCartAttributes {
  id: string;
  userId: string;
  quantity: number;
}
export interface ViewCart {
  userId: string;
}