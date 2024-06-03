import request from "supertest";
import app from "../src/app";
import db from "../src/database/config/database.config";
import jwt from "jsonwebtoken";
import { UserService } from "../src/services/user.services";
import { generateToken } from "../src/utils/tokenGenerator.utils";
import { USER_MESSAGES, JWT_CONSTANTS, MOCK_USER, ROUTES} from "../src/utils/variable.utils";

jest.mock("../src/services/user.services");
jest.mock("../src/utils/tokenGenerator.utils");

describe("Verify Email", () => {
  let sequelizeInstance: any;

  beforeAll(async () => {
    jest.setTimeout(60000);
    sequelizeInstance = await db();
    await sequelizeInstance.query(
      "TRUNCATE TABLE users RESTART IDENTITY CASCADE;"
    );
  });

  afterAll(async () => {
    if (sequelizeInstance) {
      await sequelizeInstance.close();
    }
  });

  const token = jwt.sign({ email: MOCK_USER.EMAIL }, JWT_CONSTANTS.SECRET_KEY, { expiresIn: JWT_CONSTANTS.AUTH_TOKEN_EXPIRY });
  
  test("should verify email successfully", async () => {
    const mockUser = {
      id: 1,
      email: MOCK_USER.EMAIL,
      verified: false,
    };

    (UserService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
    (UserService.updateUser as jest.Mock).mockResolvedValue({ ...mockUser, verified: true });
    (generateToken as jest.Mock).mockResolvedValue("newAuthToken");

    const res = await request(app).get(`${ROUTES.VERIFY_EMAIL}?token=${token}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe(USER_MESSAGES.EMAIL_VERIFIED);
  });

  test("should return error for invalid token", async () => {
    const res = await request(app).get(`${ROUTES.VERIFY_EMAIL}?token=invalidToken`);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(USER_MESSAGES.INVALID_TOKEN);
  });

  test("should return error for internal server error", async () => {
    (UserService.getUserByEmail as jest.Mock).mockRejectedValue(new Error());

    const res = await request(app).get(`${ROUTES.VERIFY_EMAIL}?token=${token}`);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe(USER_MESSAGES.INTERNAL_SERVER_ERROR);
  });

  test("should return error if user is not found", async () => {
    (UserService.getUserByEmail as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get(`${ROUTES.VERIFY_EMAIL}?token=${token}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe(USER_MESSAGES.USER_NOT_FOUND);
  });
});
