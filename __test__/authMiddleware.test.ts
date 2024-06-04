import { Request, Response, NextFunction } from "express";
import { protectRoute, restrictTo } from "../src/middlewares/auth.middleware";
 import jwt from "jsonwebtoken" 
 
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
  
    
    jest.spyOn(require("../src/utils/tokenBlacklist"), "isBlacklisted").mockReturnValue(true);
  
    await protectRoute(req as Request, res as Response, next);
  
   
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: "Token has been invalidated.",
    });
  });
  
});

test("should return 403 if user role is not permitted", async () => {
  const req = mockRequest();
  const res = mockResponse();
  const next = mockNext();

 
  req.user = { role: "user" };


  const middleware = restrictTo("admin");
  middleware(req as Request, res as Response, next);

  expect(res.status).toHaveBeenCalledWith(403);
  expect(res.json).toHaveBeenCalledWith({ message: "You are not authorized to perform this action" });
});

test("should return 500 and log the error on internal server error", async () => {
  const req = mockRequest({
    authorization: "Bearer valid.token.here",
  });
  const res = mockResponse();
  const next = mockNext();


  jest.spyOn(jwt, "verify").mockImplementationOnce(() => {
    throw new Error("Some internal error");
  });


  const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});

  await protectRoute(req as Request, res as Response, next);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({
    message: "Internal Server Error",
  });
  expect(consoleLogSpy).toHaveBeenCalledWith(expect.any(Error), "Error occurred");

  consoleLogSpy.mockRestore();
});



describe("protectRoute middleware with additional cases", () => {
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
      status: "error",
      message: "Token has been invalidated.",
    });
  });
  
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
    status: "error",
    message: "Token has been invalidated.",
  });
});

});