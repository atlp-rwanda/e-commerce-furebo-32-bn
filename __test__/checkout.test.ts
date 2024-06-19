import { Request, Response } from "express";
import sinon from "sinon";
import { OrderController } from "../src/controllers/checkout.controller";
import { orderService } from "../src/services/order.services";

describe("OrderController.checkout", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: sinon.SinonStub;
  let jsonStub: sinon.SinonStub;
  let createOrderStub: sinon.SinonStub;
  beforeEach(() => {
    req = {
      body: {},
    };
    jsonStub = sinon.stub().returnsThis();
    statusStub = sinon.stub().returns({ json: jsonStub });
    res = {
      status: statusStub,
      json: jsonStub,
    };
    createOrderStub = sinon.stub(orderService, "createOrder");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return 400 if required fields are missing", async () => {
    req.body = {
      userId: "",
      deliveryAddress: "",
      paymentMethod: "",
      products: [],
    };

    await OrderController.checkout(req as Request, res as Response);

    expect(statusStub.calledOnceWith(400)).toBe(true);
    expect(
      jsonStub.calledOnceWith({ message: "All fields are required" })
    ).toBe(true);
  });

  it("should create an order and return 201 if all conditions are met", async () => {
    const orderData = {
      userId: "user1",
      deliveryAddress: { street: "123 Street", city: "City" },
      paymentMethod: "credit_card",
      products: [{ id: "product1", price: 100, quantity: 2 }],
    };

    req.body = orderData;

    const createdOrder = {
      orderId: "order1",
      ...orderData,
      totalAmount: 200,
      status: "pending",
    };

    createOrderStub.resolves(createdOrder);

    await OrderController.checkout(req as Request, res as Response);

    expect(
      createOrderStub.calledOnceWith({
        buyerId: orderData.userId,
        deliveryAddress: orderData.deliveryAddress,
        paymentMethod: orderData.paymentMethod,
        status: "pending",
        products: orderData.products,
        totalAmount: 200,
      })
    ).toBe(true);
    expect(statusStub.calledOnceWith(201)).toBe(true);
    expect(jsonStub.calledOnceWith(createdOrder)).toBe(true);
  });

  it("should return 500 if an error occurs", async () => {
    const orderData = {
      userId: "user1",
      deliveryAddress: { street: "123 Street", city: "City" },
      paymentMethod: "credit_card",
      products: [{ id: "product1", price: 100, quantity: 2 }],
    };

    req.body = orderData;

    const error = new Error("Something went wrong");
    createOrderStub.rejects(error);

    await OrderController.checkout(req as Request, res as Response);

    expect(statusStub.calledOnceWith(500)).toBe(true);
    expect(jsonStub.calledOnceWith({ message: "Internal server error" })).toBe(
      true
    );
  });
});