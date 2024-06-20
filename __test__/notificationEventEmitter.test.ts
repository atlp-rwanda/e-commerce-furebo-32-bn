import { sendEmail } from "../src/utils/email.utils";
import { NotificationService } from "../src/services/notification.services";
import User from "../src/database/models/user.model";
import { notificationEventEmitter } from "../src/events/notificationEvents.event";

jest.mock("../src/utils/email.utils", () => ({
  sendEmail: jest.fn(),
}));
jest.mock("../src/services/notification.services", () => ({
  NotificationService: {
    createNotification: jest.fn(),
  },
}));
jest.mock("../src/database/models/user.model", () => ({
  findByPk: jest.fn(),
}));

describe("Notification Event Emitter", () => {
  const userMock = {
    email: "user@example.com",
  };

  const productMock = {
    seller_id: 1,
    productName: "Test Product",
  };

  beforeEach(() => {
    (User.findByPk as jest.Mock).mockReset();
    (sendEmail as jest.Mock).mockReset();
    (NotificationService.createNotification as jest.Mock).mockReset();
  });

  describe("productCreated event", () => {
    it("should send email and create notification on product created", async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(userMock);

      notificationEventEmitter.emit("productCreated", productMock);

      expect(User.findByPk).toHaveBeenCalledWith(productMock.seller_id);
      await new Promise(process.nextTick); // Wait for async operations

      expect(sendEmail).toHaveBeenCalledWith(
        userMock.email,
        "Product Created successfully",
        "Product with name: Test Product was created successfully",
        "<p>Product with name: <b>Test Product</b> was created successfully</p>"
      );
      expect(NotificationService.createNotification).toHaveBeenCalledWith({
        notification: "Product added",
        description: `Product: ${productMock.productName} is now available for sale`,
        user_id: productMock.seller_id,
      });
    });
  });

  describe("productExpired event", () => {
    it("should create notification on product expired", async () => {
      notificationEventEmitter.emit("productExpired", productMock);

      await new Promise(process.nextTick); // Wait for async operations

      expect(NotificationService.createNotification).toHaveBeenCalledWith({
        notification: "Product Expired",
        description: `Product: ${productMock.productName} has expired`,
        user_id: productMock.seller_id,
      });
    });
  });

  describe("productDeleted event", () => {
    it("should send email and create notification on product deleted", async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(userMock);

      notificationEventEmitter.emit("productDeleted", productMock);

      expect(User.findByPk).toHaveBeenCalledWith(productMock.seller_id);
      await new Promise(process.nextTick); // Wait for async operations

      expect(sendEmail).toHaveBeenCalledWith(
        userMock.email,
        "Product Deleted successfully",
        "Product with name: Test Product has been Deleted successfully",
        "<p>Product with name: <b>Test Product</b> has been Deleted successfully</p>"
      );
      expect(NotificationService.createNotification).toHaveBeenCalledWith({
        notification: "Product deleted",
        description: `Product: ${productMock.productName} has been deleted`,
        user_id: productMock.seller_id,
      });
    });
  });

  describe("productBought event", () => {
    it("should send email and create notification on product bought", async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(userMock);

      notificationEventEmitter.emit("productBought", productMock);

      expect(User.findByPk).toHaveBeenCalledWith(productMock.seller_id);
      await new Promise(process.nextTick); // Wait for async operations

      expect(sendEmail).toHaveBeenCalledWith(
        userMock.email,
        "Product Bought successfully",
        "Product with name: Test Product has been Bought",
        "<p>Product with name: <b>Test Product</b> has been Bought</p>"
      );
      expect(NotificationService.createNotification).toHaveBeenCalledWith({
        notification: "Product Bought",
        description: `Product: ${productMock.productName} has been Bought`,
        user_id: productMock.seller_id,
      });
    });
  });
});
