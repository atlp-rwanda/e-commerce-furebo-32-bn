import { Request, Response } from "express";
import {
  getNotifications,
  mark_notification_as_read,
} from "../src/controllers/notification.controller";
import { NotificationService } from "../src/services/notification.services";

// Mock the NotificationService
jest.mock("../src/services/notification.services");

describe("Notification Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("getNotifications", () => {
    it("should return notifications for a user", async () => {
      const userId = { id: "user123" };
      const notifications = [{ id: 1, message: "Notification 1" }];
      (NotificationService.getNotifications as jest.Mock).mockResolvedValue(
        notifications
      );

      req.user = userId;

      await getNotifications(req as Request, res as Response);

      expect(NotificationService.getNotifications).toHaveBeenCalledWith(
        userId.id
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ notifications });
    });

    it("should handle errors", async () => {
      const userId = { id: "user123" };
      const errorMessage = "Error fetching notifications";
      (NotificationService.getNotifications as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      req.user = userId;

      await getNotifications(req as Request, res as Response);

      expect(NotificationService.getNotifications).toHaveBeenCalledWith(
        userId.id
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: new Error(errorMessage) });
    });
  });

  describe("mark_notification_as_read", () => {
    it("should mark notifications as read", async () => {
      const notificationIds = ["notif1", "notif2"];
      const result = { message: "Notifications marked as read" };
      (
        NotificationService.markNotificationAsRead as jest.Mock
      ).mockResolvedValue(result);

      req.body = { notification_ids: notificationIds };

      await mark_notification_as_read(req as Request, res as Response);

      expect(NotificationService.markNotificationAsRead).toHaveBeenCalledWith(
        notificationIds
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ notifications: result });
    });

    it("should handle errors", async () => {
      const notificationIds = ["notif1", "notif2"];
      const errorMessage = "Error marking notifications as read";
      (
        NotificationService.markNotificationAsRead as jest.Mock
      ).mockRejectedValue(new Error(errorMessage));

      req.body = { notification_ids: notificationIds };

      await mark_notification_as_read(req as Request, res as Response);

      expect(NotificationService.markNotificationAsRead).toHaveBeenCalledWith(
        notificationIds
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: new Error(errorMessage) });
    });
  });
});
