import { Request, Response, NextFunction } from "express";
import { protectRoute, restrictTo } from "../src/middlewares/auth.middleware";
/* import jwt from "jsonwebtoken";
 */
type Headers = {
  authorization?: string;
};

const mockRequest = (headers: Headers = {}) => {
  return {
    headers: {
      authorization: headers.authorization || "",
    },
    user: undefined,
  } as Partial<Request>;
};

const mockResponse = () => {
  const res = {} as Partial<Response>;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = () => jest.fn() as NextFunction;

describe("Authontication middleware", () => {
  test("should throw missing authorization error", () => {
    const req = mockRequest({ authorization: "" });
    const res = mockResponse();
    const next = mockNext();

    protectRoute(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Authorization header missing",
    });
  });
  test("should return 401 if JWT_SECRET is missing", async () => {
    const req = mockRequest({
      authorization: "Bearer valid.token.here",
    });
    const res = mockResponse();
    const next = mockNext();

    const originalSecret = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;
    await protectRoute(req as Request, res as Response, next as NextFunction);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "JWT_SECRET is missing" });

    process.env.JWT_SECRET = originalSecret;
  });
  test("should return 401 if token is invalid", async () => {
    const req = mockRequest({
      authorization: "Bearer invalid.token.here",
    });
    const res = mockResponse();
    const next = mockNext();

    await protectRoute(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized request, Try again",
    });
  });
});
describe("restrictTo middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      user: {
        role: "admin", // Simulate an admin user
      },
    };
    res = {
      status: jest.fn(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  test("should allow access for permitted roles", () => {
    const middleware = restrictTo("admin");

    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  jest.mock("jsonwebtoken");
  jest.mock("jsonwebtoken", () => ({
    // Mock the verify function to throw an error
    verify: jest.fn((_token, _secret, callback) => {
      callback(new Error("Internal Server Error"));
    })
  }));
describe("protectRoute middleware", () => {
  test("should return 401 if token is blacklisted", async () => {
    const req = mockRequest({
      authorization: "Bearer blacklisted.token.here",
    });
    const res = mockResponse();
    const next = mockNext();

    // Mock isBlacklisted function to return true for blacklisted token
    jest.spyOn(require("../src/utils/tokenBlacklist"), "isBlacklisted").mockReturnValue(true);

    await protectRoute(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Token has been invalidated.",
    });
  });
});

test("should return 403 if user role is not permitted", async () => {
  const req = mockRequest();
  const res = mockResponse();
  const next = mockNext();

  // Setting up a user with a role that is not permitted
  req.user = { role: "user" };

  // Simulating middleware for admin role
  const middleware = restrictTo("admin");
  middleware(req as Request, res as Response, next);

  expect(res.status).toHaveBeenCalledWith(403);
  expect(res.json).toHaveBeenCalledWith({ message: "You are not authorized to perform this action" });
});

test("should return 401 if token is blacklisted", async () => {
  const req = mockRequest({
    authorization: "Bearer blacklisted.token.here",
  });
  const res = mockResponse();
  const next = mockNext();

  // Mocking isBlacklisted function to return true for blacklisted token
  jest.spyOn(require("../src/utils/tokenBlacklist"), "isBlacklisted").mockReturnValue(true);

  await protectRoute(req as Request, res as Response, next);

  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({ message: "Token has been invalidated." });
});
test("should return 401 if token is blacklisted", async () => {
  const req = mockRequest({
    authorization: "Bearer blacklisted.token.here",
  });
  const res = mockResponse();
  const next = mockNext();

  
  jest.spyOn(require("../src/utils/tokenBlacklist"), "isBlacklisted").mockReturnValue(true);

  await protectRoute(req as Request, res as Response, next);

  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({ message: "Token has been invalidated." });
});
test("should return 401 if token is blacklisted", async () => {

  const req = mockRequest({
    authorization: "Bearer blacklisted.token.here",
  });
  const res = mockResponse(); 
  const next = mockNext(); 

  
  jest.spyOn(require("../src/utils/tokenBlacklist"), "isBlacklisted").mockReturnValue(true);

 
  await protectRoute(req as Request, res as Response, next);

  
  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({
    message: "Token has been invalidated.",
  });
});
});
