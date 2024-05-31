import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize.config";
import { UserAttributes, UserSignupAttributes } from '../../types/user.types'
import Profile from "./Profile";
const currentDate = new Date();
const userPasswordValidityPeriod = new Date(currentDate);
userPasswordValidityPeriod.setMonth(currentDate.getMonth() + 3);

class User
  extends Model<UserAttributes, UserSignupAttributes>
  implements UserAttributes
{
  declare id: string;

  declare firstName: string;

  declare lastName: string;

  declare email: string;

  declare password: string;

  declare phone: string;

  declare birthDate: Date;

  declare verified: boolean;

  declare role: string;

  declare profileURL: string;

  declare isActive: boolean;

  declare createdAt: Date;

  declare updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      onDelete: "CASCADE"
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profileURL: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ""
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
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
    modelName: "User",
    tableName: "users"
  }
);

 User.hasOne(Profile, {
   foreignKey: "userId",
   as: "profile",
 });

export default User;
