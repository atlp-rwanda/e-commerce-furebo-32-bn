import Notification from "../database/models/notification.model";
import { createNotificationAttributes } from "../types/notification.types";
import { Op } from "sequelize";

export class NotificationService {
  static async createNotification(notification: createNotificationAttributes) {
    return await Notification.create(notification);
  }

  static async getNotifications(userID: string) {
    return await Notification.findAll({ where: { user_id: userID } });
  }

  static async markNotificationAsRead(notification_ids: string[]) {
    try {
      const result = await Notification.update(
        { read: true },
        {
          where: { id: { [Op.in]: notification_ids } },
          individualHooks: true,
        }
      );
      return result;
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      throw error;
    }
  }
}
