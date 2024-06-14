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
  public paymentMethod!: string;
  public status!: string;
  public products!: any;
  public totalAmount!: number;
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
    paymentMethod: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    products: { type: DataTypes.JSONB, allowNull: false },
    totalAmount: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    modelName: "Order",
    tableName: "Orders",
    timestamps: true,
  }
);
export default Order;
