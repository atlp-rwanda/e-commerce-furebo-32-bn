import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize.config";
import User from "./user.model";
import Product from "./Product.model";

class Cart extends Model {
    [x: string]: any;
  declare id: string;
  declare userId: string;
  declare productId: string;
  declare quantity: number;
    Product: any;

  static associate() {
    Cart.belongsTo(User, { foreignKey: "userId" });
    Cart.belongsTo(Product, { foreignKey: "productId" });
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
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
  },
  {
    sequelize,
    modelName: "Cart",
    tableName: "Carts",
  }
);

export default Cart;
