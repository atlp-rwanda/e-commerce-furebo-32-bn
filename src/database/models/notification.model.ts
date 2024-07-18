import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize.config";
import {
  NotificationAttributes,
  createNotificationAttributes,
} from "../../types/notification.types";
import User from "./user.model";

class Notification
  extends Model<NotificationAttributes, createNotificationAttributes>
  implements NotificationAttributes
{
  declare id: string;

  declare notification: string;

  declare description: string;

  declare user_id: string;

  declare createdAt: Date;

  declare updatedAt: Date;

  static associate(): void {
    Notification.belongsTo(User, { foreignKey: "user_id" });
  }
}

Notification.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      onDelete: "CASCADE",
    },
    notification: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    timestamps: true,
    sequelize: sequelize,
    modelName: "Notification",
    tableName: "Notifications",
  }
);

export default Notification;
