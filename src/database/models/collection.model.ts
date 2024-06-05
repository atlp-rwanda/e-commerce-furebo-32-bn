import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize.config";
import { CollectionAttributes,createCollectionAttributes } from "../../types/collection.types";
import User from "./user.model";

class Collection
  extends Model<CollectionAttributes, createCollectionAttributes>
  implements CollectionAttributes
{
  declare id: string;

  declare CollectionName: string;

  declare description:string;

  declare seller_id: string;

  declare createdAt: Date;

  declare updatedAt: Date;

  static associate(): void {
    Collection.belongsTo(User, { foreignKey: 'seller_id' })
   }
}

Collection.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      onDelete: "CASCADE"
    },
    CollectionName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description:{
      type:DataTypes.STRING,
      allowNull:false,
      validate: {
        notEmpty: true
      }
    },
    seller_id:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notEmpty:true
        }
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE
    },
  },
  {
    timestamps: true,
    sequelize: sequelize,
    modelName: "Seller collection",
    tableName: "Collections"
  }
);

export default Collection;
