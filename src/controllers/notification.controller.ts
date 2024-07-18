import { Request, Response } from "express";
import { NotificationService } from "../services/notification.services";

export const getNotifications = async (req: Request, res: Response) => {
  const userId = req.user;
  try {
    const notifications = await NotificationService.getNotifications(userId.id);
    return res.status(200).json({ notifications });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

export const mark_notification_as_read = async (
  req: Request,
  res: Response
) => {
  const notification_ids = req.body.notification_ids;
  try {
    const notifications = await NotificationService.markNotificationAsRead(
      notification_ids
    );
    return res.status(200).json({ notifications });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
