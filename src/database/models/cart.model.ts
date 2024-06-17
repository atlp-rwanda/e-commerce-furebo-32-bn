
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize.config";
import { CartAttributes, createCartAttributes } from "../../types/cart.types";
import Product from "./Product.model";
import User from "./user.model";

class Cart extends Model<CartAttributes, createCartAttributes> implements CartAttributes {
  static toJSON() {
    throw new Error("Method not implemented.");
  }
  declare id: string;
  declare userId: string;
  declare items: { productId: string, quantity: number }[];
  declare total: number;
  static items: any;

  static associate(): void {
    Cart.belongsTo(User, { foreignKey: 'userId' });
    Cart.belongsToMany(Product, { through: 'CartItems', foreignKey: 'cartId' });
  }
}

Cart.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      onDelete: "CASCADE"
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    items: {
      type: DataTypes.ARRAY(DataTypes.JSONB),
      allowNull: false,
      defaultValue: []
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    sequelize: sequelize,
    modelName: "Cart",
    tableName: "Cart"
  }
);

export default Cart;
