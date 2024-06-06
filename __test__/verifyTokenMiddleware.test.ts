import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { verifyTokenMiddleware, getTokenFromRequest  } from "../src/middlewares/verifyToken.middleware";
import { USER_MESSAGES, JWT_CONSTANTS, MOCK_USER } from "../src/utils/variable.utils";


describe("Verify Token Middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { query: {}, headers: {}, body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  
  test("should call next() if token is valid", async () => {
    req.query = req.query || {};
    req.query.token = jwt.sign({ userId: MOCK_USER.ID }, JWT_CONSTANTS.SECRET_KEY, { expiresIn: "1h" });
    

    verifyTokenMiddleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  test("should return 400 if token is missing", async () => {
    verifyTokenMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ status: 'error', message: USER_MESSAGES.INVALID_TOKEN });
  });

  test("should return 400 if token is invalid", async () => {
    req.query = req.query || {};
    req.query.token = MOCK_USER.MOCK_STRING;
    verifyTokenMiddleware(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(400);
    
    
    expect(res.json).toHaveBeenCalledWith({ status: 'error', message: USER_MESSAGES.INVALID_TOKEN });
  });

  test("should return 500 if token cannot be verified", async () => {
    req.query = req.query || {};
    req.query.token = jwt.sign({ userId: MOCK_USER.ID}, JWT_CONSTANTS.SECRET_KEY, { expiresIn: JWT_CONSTANTS.SHORT_TOKEN_EXPIRY });

    verifyTokenMiddleware(req as Request, res as Response, null as unknown as NextFunction);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ status: 'error', message: USER_MESSAGES.INTERNAL_SERVER_ERROR });
    }); 
});

describe("get Token From Request", () => {

  let req: Partial<Request>;

  beforeEach(() => {
    req = { query: {}, headers: {}, body: {} };
  });

  test("should return token from query", () => {
    
    req.query = req.query || {};
    req.query.token = MOCK_USER.MOCK_STRING;
    const token = getTokenFromRequest(req as Request);

    expect(token).toBe(MOCK_USER.MOCK_STRING);
  });

  test("should return token from headers", () => {
    req.headers = req.headers || {};
    const authtoken = jwt.sign({ userId: MOCK_USER.ID }, JWT_CONSTANTS.SECRET_KEY, { expiresIn: JWT_CONSTANTS.REFRESH_TOKEN_EXPIRY });
    req.headers.authorization = `Bearer ${authtoken}`;
    const token = getTokenFromRequest(req as Request);
    expect(token).toBe(authtoken);
  });


  test("should return null if token is not found", () => {
    const token = getTokenFromRequest(req as Request);

    expect(token).toBeNull();
  });
});