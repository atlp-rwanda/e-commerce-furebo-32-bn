import { Optional } from "sequelize";

export interface CartAttributes {
  id?: string;
  userId?: string;
  items?: { productId: string, quantity: number }[];
  total?: number;
}

export interface createCartAttributes
  extends Optional<CartAttributes, "id" | "items" | "total"> {}

export interface CartOutputs extends Required<CartAttributes> {}

export type INTUSERPRODUCT = {
  name: string;
  unit_amount: number;
  image: string;
  quantity: number;
};