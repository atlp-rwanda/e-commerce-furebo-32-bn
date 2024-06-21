import { Optional } from "sequelize";

export interface orderAttributes {
  orderId?: string;
  deliveryAddress: any;
  buyerId: string;
  paymentMethod: any;
  status: string;
  products: any;
  totalAmount: number;
  expectedDeliveryDate?: Date;
}

export interface orderCreationAttributes
  extends Optional<
    orderAttributes,
    | "orderId"
    | "deliveryAddress"
    | "buyerId"
    | "paymentMethod"
    | "status"
    | "products"
    | "totalAmount"
  > {}
