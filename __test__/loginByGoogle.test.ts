import passport, { Profile } from "passport";
import sinon from "sinon";
import User from "../src/database/models/user.model";
import { googleAuthCallBack } from "../src/services/Login-By-Google.services";
import { Request, Response } from "express";
import { LoginViaGoogle } from "../src/controllers/user.controller";
import { generateToken } from "../src/utils/tokenGenerator.utils";
import dotenv from "dotenv";

dotenv.config();

describe("googleAuthCallBack", () => {
  let sandbox: sinon.SinonSandbox;
  let done: sinon.SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    done = sandbox.stub();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should authenticate user if found", async () => {
    const mockProfile = {
      id: "123456",
      emails: [{ value: "test@example.com" }],
      name: {
        givenName: "John",
        familyName: "Doe",
      },
    } as Profile;

    const mockUser = {
      id: 1,
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
      password: process.env.GOOGLE_PASSWORD,
      verified: process.env.GOOGLE_VERIFY,
      role: process.env.GOOGLE_ROLE,
    } as any;

    sandbox.stub(User, "findOrCreate").resolves([mockUser, true]);

    await googleAuthCallBack("accessToken", "refreshToken", mockProfile, done);

    sinon.assert.calledOnce(User.findOrCreate as sinon.SinonStub);
    sinon.assert.calledWith(User.findOrCreate as sinon.SinonStub, {
      where: { email: "test@example.com" },
      defaults: {
        firstName: "John",
        lastName: "Doe",
        password: process.env.GOOGLE_PASSWORD,
        verified: process.env.GOOGLE_VERIFY,
        role: process.env.GOOGLE_ROLE,
      },
    });

    sinon.assert.calledOnce(done);
    sinon.assert.calledWith(done, null, mockUser);
  });

  it("should handle errors gracefully", async () => {
    const mockProfile = {
      id: "123456",
      emails: [{ value: "test@example.com" }],
      name: {
        givenName: "John",
        familyName: "Doe",
      },
    } as Profile;

    const errorMessage = "Error occurred";
    const error = new Error(errorMessage);

    sandbox.stub(User, "findOrCreate").rejects(error);

    try {
      await googleAuthCallBack(
        "accessToken",
        "refreshToken",
        mockProfile,
        done
      );
    } catch (err: any) {
      expect(err.message).toBe("Error occured please try again");
    }

    sinon.assert.notCalled(done);
  });
});

import { googleAuthenticate } from "../src/controllers/user.controller";
jest.mock("passport");

describe("googleAuthenticate Function", () => {
  it("should call passport.authenticate with the correct arguments", () => {
    const authenticateMock = jest.fn();
    (passport.authenticate as jest.Mock).mockReturnValue(authenticateMock);

    const result = googleAuthenticate();

    expect(passport.authenticate).toHaveBeenCalledWith("google", {
      scope: ["email", "profile"],
    });
    expect(result).toBe(authenticateMock);
  });
});
import { googleAuthFailed } from "../src/controllers/user.controller";

describe("googleAuthFailed Function", () => {
  it("should return a 400 status and error message", () => {
    const req = {} as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as any;

    googleAuthFailed(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Authentication failed" });
  });
});

jest.mock("../src/utils/tokenGenerator.utils");
