import { Optional } from "sequelize";

export interface ProductAttributes {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  available?: boolean;
  expireDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductCreationAttributes
  extends Optional<ProductAttributes, "id"> {}

export interface ProductOutputs extends Required<ProductAttributes> {}
