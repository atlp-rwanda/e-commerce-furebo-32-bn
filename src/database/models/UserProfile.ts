/* eslint-disable quotes */
/* eslint-disable max-len */
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/sequelize.config";
import User from "./user.model";

interface UserProfileAttributes {
  id: string;
  userId: string;
  name: string;
  gender?: string;
  birthdate?: string;
  preferredLanguage?: string;
  preferredCurrency?: string;
  whereYouLive?: string;
  billingAddress?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserProfileCreationAttributes
  extends Optional<UserProfileAttributes, "id"> {}

// eslint-disable-next-line require-jsdoc
class UserProfile
  extends Model<UserProfileAttributes, UserProfileCreationAttributes>
  implements UserProfileAttributes
{
  public id!: string;

  public userId!: string;

  public name!: string;

  public gender?: string;

  public birthdate?: string;

  public preferredLanguage?: string;

  public preferredCurrency?: string;

  public whereYouLive?: string;

  public billingAddress?: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public profile?: UserProfile;
}

UserProfile.init(
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
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    birthdate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    preferredLanguage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    preferredCurrency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    whereYouLive: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    billingAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'UserProfile',
    tableName: 'UserProfiles',
    timestamps: true,
  }
);


UserProfile.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});


User.hasOne(UserProfile, {
  foreignKey: 'userId',
  as: 'profile',
});


export default UserProfile;
