import request from "supertest";
import app from "../src/app";
import db from "../src/database/config/database.config";
import { userLogout } from "../src/controllers/user.controller";
import { Request, Response } from "express"; 

import * as tokenUtils from '../src/utils/tokenBlacklist';

let userId: any;
let token: any;

describe("User", () => {
  let sequelizeInstance: any;

  beforeAll(async () => {
    jest.setTimeout(60000);
    sequelizeInstance = await db();
    await sequelizeInstance.query(
      "TRUNCATE TABLE users RESTART IDENTITY CASCADE;"
    );
    const newUser = {
      firstName: "Mugisha",
      lastName: "Walmond",
      email: "mugishaadminn@gmail.com",
      password: process.env.TEST_USER_PASS,
      role: "admin",
      phone: "+13362851038",
    };
    const adminRes = await request(app).post("/api/users/signup").send(newUser);
    token = adminRes.body.token;
  });

  afterAll(async () => {
    if (sequelizeInstance) {
      await sequelizeInstance.close();
    }
  });

  describe("Test user registration", () => {
    test("user makes registration using proper credentials", async () => {
      const newUser = {
        firstName: "Mugisha",
        lastName: "Walmond",
        email: "mugisha@gmail.com",
        password: process.env.TEST_USER_PASS,
        role: "admin",
        phone: "+13362851038",
      };
      const res = await request(app).post("/api/users/signup").send(newUser);
      expect(res.statusCode).toBe(200);
      userId = res.body.data.user.id;
      console.log(userId);

      expect(res.body.message).toBe("User created successfully");
    });

    test("user makes registration using existing email", async () => {
      const newUser = {
        firstName: "Mugisha",
        lastName: "Walmond",
        email: "mugisha@gmail.com",
        password: process.env.TEST_USER_PASS,
        role: "seller",
        phone: "+13362851038",
      };
      const res = await request(app).post("/api/users/signup").send(newUser);
      expect(res.statusCode).toBe(409);
      expect(res.body.message).toBe("User already exists. Please login again");
    });

    test("user makes registration without using phone number", async () => {
      const newUser = {
        firstName: "Mugisha",
        lastName: "Walmond",
        email: "mugishajosep9@gmail.com",
        password: process.env.TEST_USER_PASS,
        role: "seller",
      };
      const res = await request(app).post("/api/users/signup").send(newUser);
      expect(res.statusCode).toBe(400);
      expect(res.body.data.message).toBe("Phone number is required");
    });

    test("user registration without role", async () => {
      const newUser = {
        firstName: "Mugisha",
        lastName: "Walmond",
        email: "mugishajosep9@gmail.com",
        password: process.env.TEST_USER_PASS,
        phone: "+13362851038",
      };
      const res = await request(app).post("/api/users/signup").send(newUser);
      expect(res.statusCode).toBe(400);
      expect(res.body.data.message).toBe("Role is required");
    });

    test("user registration without last name", async () => {
      const newUser = {
        firstName: "Mugisha",
        email: "mugishajosep9@gmail.com",
        password: process.env.TEST_USER_PASS,
        role: "buyer",
        phone: "+13362851038",
      };
      const res = await request(app).post("/api/users/signup").send(newUser);
      expect(res.statusCode).toBe(400);
      expect(res.body.data.message).toBe("Last name is required");
    });

    test("user registration without first name", async () => {
      const newUser = {
        lastName: "Walmond",
        email: "mugishajosep9@gmail.com",
        password: process.env.TEST_USER_PASS,
        role: "buyer",
        phone: "+13362851038",
      };
      const res = await request(app).post("/api/users/signup").send(newUser);
      expect(res.statusCode).toBe(400);
      expect(res.body.data.message).toBe("First name is required");
    });

    test("user registration without email", async () => {
      const newUser = {
        firstName: "Mugisha",
        lastName: "Walmond",
        password: process.env.TEST_USER_PASS,
        role: "seller",
        phone: "+13362851038",
      };
      const res = await request(app).post("/api/users/signup").send(newUser);
      expect(res.statusCode).toBe(400);
      expect(res.body.data.message).toBe("Email address is required");
    });
  });

  describe("Update user role", () => {
    test("update user role without login", async () => {
      const res = await request(app)
        .patch(`/api/users/${userId}`)
        .send({ role: "seller" });
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Authorization header missing");
    });

    test("update user role with invalid token", async () => {
      const res = await request(app)
        .patch(`/api/users/${userId}`)
        .set("Authorization", `Bearer kdekefiwfgj`)
        .send({ role: "seller" });
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Unauthorized request, Try again");
    });

    test("update user role successful", async () => {
      const res = await request(app)
        .patch(`/api/users/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ role: "seller" });
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("User role updated successfully");
    });
    test("update user role  and user not found", async () => {
      const res = await request(app)
        .patch(`/api/users/${"21c2e6b1-eb05-4dde-b7bb-25bad784c296"}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ role: "seller" });
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("User not found");
    });
  });

  describe("Change account status", () => {
    test("Change account status without login", async () => {
      const res = await request(app).patch(
        `/api/users/change-account-status/${userId}`
      );
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Authorization header missing");
    });
    test("Change account status with invalid token", async () => {
      const res = await request(app)
        .patch(`/api/users/change-account-status/${userId}`)
        .set("Authorization", `Bearer kdekefiwfgj`);
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Unauthorized request, Try again");
    });
    test("Change acount status without specifing reason", async () => {
      const res = await request(app)
        .patch(`/api/users/change-account-status/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({});
      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe("Activation reason is required");
    });
    test("Change acount status was successful", async () => {
      const res = await request(app)
        .patch(`/api/users/change-account-status/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ activationReason: "Violetion" });
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Account status updated successfully");
    });
    test("Change acount status and user not found", async () => {
      const res = await request(app)
        .patch(
          `/api/users/change-account-status/${"21c2e6b1-eb05-4dde-b7bb-25bad784c296"}`
        )
        .set("Authorization", `Bearer ${token}`)
        .send({ activationReason: "Violetion" });
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("User not found");
    });
  });


  describe("Test user login", () => {
    test("user logs in with correct credentials", async () => {
      const loginUser = {
        email: "mugisha@gmail.com",
        password: process.env.TEST_USER_PASS,
      };
      const res = await request(app).post("/api/users/login").send(loginUser);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Login successful");
      expect(res.body).toHaveProperty("token");
    });

    test("user logs in with incorrect password", async () => {
      const loginUser = {
        email: "mugisha@gmail.com",
        password: process.env.TEST_USER_WRONG_PASS,
      };
      const res = await request(app).post("/api/users/login").send(loginUser);
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Invalid email or password");
    });

    test("user logs in with non-existing email", async () => {
      const loginUser = {
        email: "nonexistentemail@gmail.com",
        password: process.env.TEST_USER_PASS,
      };
      const res = await request(app).post("/api/users/login").send(loginUser);
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Invalid email or password");
    });

    test("user logs in without email", async () => {
      const loginUser = {
        password: process.env.TEST_USER_PASS,
      };
      const res = await request(app).post("/api/users/login").send(loginUser);
      expect(res.statusCode).toBe(400);
      expect(res.body.data.message).toBe("Email address is required");
    });

    test("user logs in without password", async () => {
      const loginUser = {
        email: "mugisha@gmail.com",
      };
      const res = await request(app).post("/api/users/login").send(loginUser);
      expect(res.statusCode).toBe(400);
      expect(res.body.data.message).toBe("Password is required.");
    });
  });

  describe("Update user password", () => {
    test("update password without login", async () => {
      const res = await request(app)
        .patch(`/api/users/${userId}/updatepassword`)
        .send({
          oldPassword: process.env.TEST_USER_PASS,
          newPassword: "newPassword123",
          confirmNewPassword: "newPassword123",
        });
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Authorization header missing");
    });
  
    test("update password with invalid token", async () => {
      const res = await request(app)
        .patch(`/api/users/${userId}/updatepassword`)
        .set("Authorization", `Bearer invalidToken`)
        .send({
          oldPassword: process.env.TEST_USER_PASS,
          newPassword: "newPassword123",
          confirmNewPassword: "newPassword123",
        });
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Unauthorized request, Try again");
    });
  
    test("update password with incorrect old password", async () => {
      const res = await request(app)
        .patch(`/api/users/${userId}/updatepassword`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          oldPassword: "wrongPassword@123",
          newPassword: "newPassword@123",
          confirmNewPassword: "newPassword@123",
        });
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Enter correct old password");
    });
  
    test("update password with mismatched new passwords", async () => {
      const res = await request(app)
        .patch(`/api/users/${userId}/updatepassword`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          oldPassword: process.env.TEST_USER_PASS,
          newPassword: "newPassword123@123",
          confirmNewPassword: "differentPassword@123",
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("New password and confirm password do not match");
    });
  
    test("update password successfully", async () => {
      const res = await request(app)
        .patch(`/api/users/${userId}/updatepassword`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          oldPassword: process.env.TEST_USER_PASS,
          newPassword: "newPassword@123",
          confirmNewPassword: "newPassword@123",
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Password updated successfully");
    });
  
    test("update password and user not found", async () => {
      const res = await request(app)
        .patch(`/api/users/nonexistentuser/updatepassword`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          oldPassword: process.env.TEST_USER_PASS,
          newPassword: "newPassword@123",
          confirmNewPassword: "newPassword@123",
        });
      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe("An error occurred while updating the password");
    });
  });

  describe("Logout Functionality", () => {
    test("successful logout", async () => {
      const res = await request(app)
        .post("/api/users/logout")
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Logout successful");
    });
    test("user cannot logout without providing a token", async () => {
      const res = await request(app).post('/api/users/logout');
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Access denied. No token provided.');
    });

    test("user cannot logout with an invalid token", async () => {
      const res = await request(app)
        .post('/api/users/logout')
        .set('Authorization', 'Bearer invalid_token');
    
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Invalid token.');
    });
    test("Unauthorized Logout", async () => {
      const res = await request(app).post("/api/users/logout");
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message");
    });
    test("Token Missing in Authorization Header", async () => {
      const res = await request(app)
        .post("/api/users/logout")
        .set("Authorization", "Bearer");
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message");
    });
    
    
test("Error during logout", async () => {
  // Mocking the request and response objects
  const req: Request = {} as Request;
  const res: Response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  // Mocking the error
  const error = new Error("Test error");

  // Mocking the addToBlacklist function to throw an error
  jest.spyOn(tokenUtils, 'addToBlacklist').mockImplementationOnce(() => {
    throw error;
  });

  // Calling the userLogout controller function
  await userLogout(req, res);

  // Expecting the response to have status 500 and contain the error message
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({
    status: "error",
    message: "An error occurred during logout",
  });

  // Restoring the original implementation after the test
  jest.restoreAllMocks();
});
    
  });
});



describe("Testing endpoint", () => {
  test("Not found for site 404", async () => {
    const res = await request(app).get("/wrong-endpoint");
    expect(res.statusCode).toBe(404);
  });

  test("Check root route", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
  });
});