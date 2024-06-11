import { Optional } from "sequelize";

export interface ProductAttributes {
    id?: string;
    productName?: string;
    price?:number;
    seller_id?:string;
    quantity?:number;
    collection_id?:string;
    expireDate?:Date;
    description?:string;
    images?:string[];
    category?:string;
    availability?:boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }


  export interface createProductAttributes
  extends Optional<
    ProductAttributes,
    | "id"
    | "productName"
    | "price"
    | "seller_id"
    | "quantity"
    | "expireDate"
    | "images"
    | "collection_id"
    |"description"
    |"category"
    |"availability"
  > {}

export interface UserOutputs extends Required<ProductAttributes> {}