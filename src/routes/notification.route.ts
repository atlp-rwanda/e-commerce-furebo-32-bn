import express from "express";
import {
  getNotifications,
  mark_notification_as_read,
} from "../controllers/notification.controller";
import { protectRoute } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.patch("/read", protectRoute, mark_notification_as_read);
export default router;
