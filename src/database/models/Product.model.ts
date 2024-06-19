import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize.config";
import { ProductAttributes,createProductAttributes } from "../../types/product.types";
import User from "./user.model";
import Collection from "./collection.model";


class Product
  extends Model<ProductAttributes, createProductAttributes>
  implements ProductAttributes
{
  [x: string]: any;
  declare id: string;

  declare productName: string;

  declare description:string;

  declare price: number;

  declare seller_id: string;

  declare quantity: number;

  declare expireDate: Date;

  declare collection_id: string;

  declare images:string[];

  declare category:string;

  declare availability: boolean;

  declare createdAt: Date;

  declare updatedAt: Date;

  declare expired: boolean;

  static associate(): void {
    Product.belongsTo(User, { foreignKey: 'sellerId' })
    Product.belongsTo(Collection, { foreignKey: 'collectionId' })
  }
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      onDelete: "CASCADE"
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description:{
      type:DataTypes.STRING,
      allowNull:false,
      validate: {
        notEmpty: true
      }
    },
    price:{
        type:DataTypes.FLOAT,
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
    quantity:{
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notEmpty:true
      }
    },
    expireDate:{
      type:DataTypes.DATE,
      allowNull:false,
      validate:{
        notEmpty:true
      }
    },
    collection_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    availability:{
      type:DataTypes.BOOLEAN,
      defaultValue:true
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE
    },
    expired:{
      type:DataTypes.BOOLEAN,
      defaultValue:false
    },
  },
  {
    timestamps: true,
    sequelize: sequelize,
    modelName: "Product",
    tableName: "Products"
  }
);

export default Product;
