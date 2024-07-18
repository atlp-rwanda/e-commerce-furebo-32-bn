import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize.config";
import User from "./user.model";
import {
  orderAttributes,
  orderCreationAttributes,
} from "../../types/order.types";

class Order extends Model<orderAttributes, orderCreationAttributes> {
  
  public orderId!: string;
  public deliveryAddress!: any;
  public buyerId!: string;
  public paymentMethod!: any;
  public status!: string;
  public products!: any;
  public totalAmount!: number;
  public expectedDeliveryDate?: Date;
  static associate(): void {
    Order.belongsTo(User, { foreignKey: "buyerId" });
  }
}
Order.init(
  {
    orderId: {
      type: DataTypes.UUID,
      primaryKey: true,
      autoIncrement: true,
      defaultValue: DataTypes.UUIDV4,
    },
    deliveryAddress: { type: DataTypes.JSONB, allowNull: false },
    buyerId: { type: DataTypes.STRING, allowNull: false },
    paymentMethod: { type: DataTypes.JSONB, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    products: { type: DataTypes.JSONB, allowNull: false },
    totalAmount: { type: DataTypes.INTEGER, allowNull: false },
    expectedDeliveryDate: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    modelName: "Order",
    tableName: "Orders",
    timestamps: true,
  }
);
export default Order;
