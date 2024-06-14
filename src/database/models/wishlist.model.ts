import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize.config";
import Product from "./Product.model";
import User from "./user.model";
import { WishAttributes, WishCreationAttributes } from "../../types/wishlist.types";


class Wishlist
  extends Model<WishAttributes, WishCreationAttributes>
  implements WishAttributes{
    declare id: string;
    declare productId: string;
    declare userId: string;
    declare createdAt?: Date;
    declare updatedAt?: Date;
  }
  Wishlist.init(
    {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        productId: {
          type: DataTypes.UUID,
          allowNull: false,
          references:{
            model: Product,
            key: "id"
          },
          onDelete: "CASCADE"
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          references:{
            model: User,
            key: "id"
          },
          onDelete: "CASCADE"
        },
      },{
        timestamps: true,
        sequelize: sequelize,
        modelName: "Wishlist",
        tableName: "wishlists"
    }
  )
  export default Wishlist;