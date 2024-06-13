import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize.config";
import { CartAttributes, createCartAttributes } from "../../types/cart.types";
import User from "./user.model";

class Cart extends Model<CartAttributes, createCartAttributes> implements CartAttributes {
  [x: string]: any;
  declare id: string;
  declare userId: string;
  declare name: string; 
  declare description: string; 
  declare items: {
    productId: string;
    quantity: number;
    name: string;
    price: number;
    image: string;
    description: string; 
  }[];
  declare total: number;
  declare createdAt: Date;
  declare updatedAt: Date;

  static associate(): void {
    Cart.belongsTo(User, { foreignKey: 'userId' });
  }
}

Cart.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    items: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
    sequelize: sequelize,
    modelName: "Cart",
    tableName: "Carts",
  }
);

export default Cart;

