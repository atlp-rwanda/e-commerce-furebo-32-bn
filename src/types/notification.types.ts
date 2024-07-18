import { Optional } from "sequelize";

export interface NotificationAttributes {
  id?: string;
  notification: string;
  description: string;
  user_id: string;
  read?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface createNotificationAttributes
  extends Optional<
    NotificationAttributes,
    "id" | "notification" | "description" | "user_id"
  > {}

export interface UserOutputs extends Required<NotificationAttributes> {}
