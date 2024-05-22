import request from "supertest";
import app from "../../app";
import db from '../database/config/database.config';

describe("User", () => {
  let sequelizeInstance:any;

  beforeAll(async () => {
    jest.setTimeout(60000); 
    sequelizeInstance = await db();
    await sequelizeInstance.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE;');
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
        password: "Walmond@123",
        role: "seller",
        phone: "+13362851038"
      };
      const res = await request(app).post('/api/users/signup').send(newUser);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('User created successfully');
    });

    test("user makes registration using existing email", async () => {
      const newUser = {
        firstName: "Mugisha",
        lastName: "Walmond",
        email: "mugisha@gmail.com",
        password: "Walmond@123",
        role: "seller",
        phone: "+13362851038"
      };
      const res = await request(app).post('/api/users/signup').send(newUser);
      expect(res.statusCode).toBe(409);
      expect(res.body.message).toBe('User already exists. Please login again');
    });

    test("user makes registration without using phone number", async () => {
      const newUser = {
        firstName: "Mugisha",
        lastName: "Walmond",
        email: "mugishajosep9@gmail.com",
        password: "Walmond@123",
        role: "seller",
      };
      const res = await request(app).post('/api/users/signup').send(newUser);
      expect(res.statusCode).toBe(400);
      expect(res.body.data.message).toBe('Phone number is required');
    });

    test("user registration without role", async () => {
      const newUser = {
        firstName: "Mugisha",
        lastName: "Walmond",
        email: "mugishajosep9@gmail.com",
        password: "Walmond@123",
        phone: "+13362851038"
      };
      const res = await request(app).post('/api/users/signup').send(newUser);
      expect(res.statusCode).toBe(400);
      expect(res.body.data.message).toBe('Role is required');
    });

    test("user registration without last name", async () => {
      const newUser = {
        firstName: "Mugisha",
        email: "mugishajosep9@gmail.com",
        password: "Walmond@123",
        role: "buyer",
        phone: "+13362851038"
      };
      const res = await request(app).post('/api/users/signup').send(newUser);
      expect(res.statusCode).toBe(400);
      expect(res.body.data.message).toBe('Last name is required');
    });

    test("user registration without first name", async () => {
      const newUser = {
        lastName: "Walmond",
        email: "mugishajosep9@gmail.com",
        password: "Walmond@123",
        role: "buyer",
        phone: "+13362851038"
      };
      const res = await request(app).post('/api/users/signup').send(newUser);
      expect(res.statusCode).toBe(400);
      expect(res.body.data.message).toBe('First name is required');
    });

    test("user registration without email", async () => {
      const newUser = {
        firstName: "Mugisha",
        lastName: "Walmond",
        password: "Walmond@123",
        role: "seller",
        phone: "+13362851038"
      };
      const res = await request(app).post('/api/users/signup').send(newUser);
      expect(res.statusCode).toBe(400);
      expect(res.body.data.message).toBe('Email address is required');
    });
  });
});

describe("Testing endpoint", () => {
  test('Not found for site 404', async () => {
    const res = await request(app).get('/wrong-endpoint');
    expect(res.statusCode).toBe(404);
  });

  test('Check root route', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });
});
