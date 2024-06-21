import Notification from "../database/models/notification.model";
import { createNotificationAttributes } from "../types/notification.types";

export class NotificationService {
  static async createNotification(notification: createNotificationAttributes) {
    return await Notification.create(notification);
  }
}
