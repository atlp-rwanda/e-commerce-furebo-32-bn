import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/sequelize.config';
import { CartAttributes, CreateCartAttributes, CartItemAttributes } from '../../types/cart.types'; 
import User from './user.model'; 

class Cart extends Model<CartAttributes, CreateCartAttributes> implements CartAttributes {
  declare id: string;
  declare name: string;
  declare description: string;
  declare userId: string;
  declare items: CartItemAttributes[]; 
  declare total: number;
  declare createdAt: Date;
  declare updatedAt: Date;
  static userId: any;

  static associate(): void {
 
    Cart.belongsTo(User, {
      foreignKey: 'userId', 
      targetKey: 'id', 
    });
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    userId: {
      type: DataTypes.UUID, 
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      references: {
        model: 'users', 
        key: 'id', 
      },
    },
    items: {
      type: DataTypes.JSONB, 
      allowNull: false,
      defaultValue: [], 
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0, 
      validate: {
        notEmpty: true,
      },
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: 'Cart',
    tableName: 'Carts',
    timestamps: true,
  }
);

export default Cart;
