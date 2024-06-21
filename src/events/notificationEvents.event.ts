import EventEmitter from "events";
import { sendEmail } from "../utils/email.utils";
import { NotificationService } from "../services/notification.services";
import User from "../database/models/user.model";

export const notificationEventEmitter = new EventEmitter();

notificationEventEmitter.on("productCreated", async (product) => {
  try {
    const user = await User.findByPk(product.seller_id);
    if (user) {
      const subject = "Product Created successfully";
      const text = `Product with name: ${product.productName} was created successfully`;
      const html = `<p>Product with name: <b>${product.productName}</b> was created successfully</p>`;
      sendEmail(user.email, subject, text, html);

      const notification = {
        notification: "Product added",
        description: `Product: ${product.productName} is now available for sale`,
        user_id: product.seller_id,
      };

      await NotificationService.createNotification(notification);
      console.log("Product created notification sent.");
    }
  } catch (error) {
    console.error(`Error sending notification: ${error}`);
  }
});

notificationEventEmitter.on("productExpired", async (product) => {
  try {
    const notification = {
      notification: "Product Expired",
      description: `Product: ${product.productName} has expired`,
      user_id: product.seller_id,
    };
    await NotificationService.createNotification(notification);
    console.log("Product has Expired.");
  } catch (error) {
    console.error(`Error sending notification: ${error}`);
  }
});

notificationEventEmitter.on("productDeleted", async (product) => {
  try {
    const user = await User.findByPk(product.seller_id);
    if (user) {
      const subject = "Product Deleted successfully";
      const text = `Product with name: ${product.productName} has been Deleted successfully`;
      const html = `<p>Product with name: <b>${product.productName}</b> has been Deleted successfully</p>`;
      sendEmail(user.email, subject, text, html);

      const notification = {
        notification: "Product deleted",
        description: `Product: ${product.productName} has been deleted`,
        user_id: product.seller_id,
      };

      await NotificationService.createNotification(notification);
      console.log("Product deleted notification sent.");
    }
  } catch (error) {
    console.error(`Error sending notification: ${error}`);
  }
});

notificationEventEmitter.on("productBought", async (product) => {
  try {
    const user = await User.findByPk(product.seller_id);
    if (user) {
      const subject = "Product Bought successfully";
      const text = `Product with name: ${product.productName} has been Bought`;
      const html = `<p>Product with name: <b>${product.productName}</b> has been Bought</p>`;
      sendEmail(user.email, subject, text, html);

      const notification = {
        notification: "Product Bought",
        description: `Product: ${product.productName} has been Bought`,
        user_id: product.seller_id,
      };

      await NotificationService.createNotification(notification);
      console.log("Product Bought notification sent.");
    }
  } catch (error) {
    console.error(`Error sending notification: ${error}`);
  }
});
