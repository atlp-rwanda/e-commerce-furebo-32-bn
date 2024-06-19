import { Request, Response } from "express";
import sinon from "sinon";
import { CheckoutController } from "../src/controllers/checkout.controller";
import { CheckoutService } from "../src/services/Checkout.services";

describe("CheckoutController.processCheckout", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: sinon.SinonStub;
  let jsonStub: sinon.SinonStub;
  let processOrderStub: sinon.SinonStub;

  beforeEach(() => {
    req = {
      user: { id: "user1" },
      body: {},
    };
    jsonStub = sinon.stub().returnsThis();
    statusStub = sinon.stub().returns({ json: jsonStub });
    res = {
      status: statusStub,
      json: jsonStub,
    };
    processOrderStub = sinon.stub(CheckoutService, "processOrder");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return 400 if delivery or payment information is missing", async () => {
    req.body = {
      deliveryAddress: "",
      paymentMethod: "",
    };

    await CheckoutController.processCheckout(req as Request, res as Response);

    expect(statusStub.calledOnceWith(400)).toBe(true);
    expect(
      jsonStub.calledOnceWith({
        message: "Delivery and payment information are required",
      })
    ).toBe(true);
  });

  it("should process an order and return 200 if all conditions are met", async () => {
    const orderData = {
      deliveryAddress: {
        street: "123 Street",
        city: "City",
        country: "string",
        zipCode: "string",
      },
      paymentMethod: {
        method: "credit_card",
        cardNumber: "string",
        expiryDate: "string",
        cvv: "string",
      },
    };

    req.body = orderData;

    const createdOrder = {
      orderId: "order1",
      userId: "user1",
      deliveryAddress: orderData.deliveryAddress,
      paymentMethod: orderData.paymentMethod,
      totalAmount: 200,
      status: "pending",
    };

    processOrderStub.resolves(createdOrder);

    await CheckoutController.processCheckout(req as Request, res as Response);

    expect(
      processOrderStub.calledOnceWith(
        "user1",
        orderData.deliveryAddress,
        orderData.paymentMethod
      )
    ).toBe(true);
    expect(statusStub.calledOnceWith(200)).toBe(true);
    expect(
      jsonStub.calledOnceWith({
        message: "Order processed successfully",
        data: { order: createdOrder },
      })
    ).toBe(true);
  });

  it("should return 401 if unable to process order", async () => {
    const orderData = {
      deliveryAddress: {
        street: "123 Street",
        city: "City",
        country: "string",
        zipCode: "string",
      },
      paymentMethod: {
        method: "credit_card",
        cardNumber: "string",
        expiryDate: "string",
        cvv: "string",
      },
    };

    req.body = orderData;

    const error = new Error("Unable to process order");
    processOrderStub.rejects(error);

    await CheckoutController.processCheckout(req as Request, res as Response);

    expect(statusStub.calledOnceWith(401)).toBe(true);
    expect(
      jsonStub.calledOnceWith({
        message: "Unable to process order",
        error: error.message,
      })
    ).toBe(true);
  });
});
