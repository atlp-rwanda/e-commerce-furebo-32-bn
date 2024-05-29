import request from "supertest";
import app from "../../app";
import db from "../database/config/database.config";
import { Client } from "pg";


let authToken: string;

describe("User", () => {
  let sequelizeInstance: any;

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

  describe("Test user login", () => {
    test("user logs in with correct credentials", async () => {
      const loginUser = {
        email: "mugisha@gmail.com",
        password: "Walmond@123"
      };
      const res = await request(app).post('/api/users/login').send(loginUser);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Login successful');
      expect(res.body).toHaveProperty('token');
      authToken = res.body.token; 
    });

    test("user logs in with incorrect password", async () => {
      const loginUser = {
        email: "mugisha@gmail.com",
        password: "wrongpassword"
      };
      const res = await request(app).post('/api/users/login').send(loginUser);
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Invalid email or password');
    });

    
    test("user logs in with non-existing email", async () => {
      const loginUser = {
        email: "nonexistentemail@gmail.com",
        password: "Password@123"
      };
      const res = await request(app).post('/api/users/login').send(loginUser);
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Invalid email or password');
    });

    test("user logs in without email", async () => {
      const loginUser = {
        password: "Password@123"
      };
      const res = await request(app).post('/api/users/login').send(loginUser);
      expect(res.statusCode).toBe(400);
      expect(res.body.data.message).toBe('Email address is required');
    });

    test("user logs in without password", async () => {
      const loginUser = {
        email: "mugisha@gmail.com"
      };
      const res = await request(app).post('/api/users/login').send(loginUser);
      expect(res.statusCode).toBe(400);
      expect(res.body.data.message).toBe('Password is required.');
    });
  });

  describe("Test user logout", () => {
    test("user logs out successfully", async () => {
      const res = await request(app)
        .post('/api/users/logout')
        .set('Authorization', `Bearer ${authToken}`); 
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Logout successful');
    });

    test("user tries to logout without a token", async () => {
      const res = await request(app)
        .post('/api/users/logout');
      expect(res.statusCode).toBe(400); 
      expect(res.body.status).toBe('fail');
      expect(res.body.message).toBe('Authorization token is missing');
    });

    test("user tries to logout with an invalid token", async () => {
      const res = await request(app)
        .post('/api/users/logout')
        .set('Authorization', 'Bearer invalidToken');
      expect(res.statusCode).toBe(401); 
    });

    test("user tries to logout with an invalid token", async () => {
      const res = await request(app)
        .post('/api/users/logout')
        .set('Authorization', 'Bearer invalidToken');
      expect(res.statusCode).toBe(401); 
    });

    test("user logout with valid token should blacklist token in database", async () => {
      const token = 'validToken';
      const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
      });
      await client.connect();
    
      await client.query('INSERT INTO blacklisted_tokens (token) VALUES ($1)', [token]);
      await client.end();
      
      const res = await request(app)
        .post('/api/users/logout')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      
     
      const clientCheck = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
      });
      await clientCheck.connect();
      const result = await clientCheck.query('SELECT * FROM blacklisted_tokens WHERE token = $1', [token]);
      await clientCheck.end();
      
      expect(result.rows.length).toBe(1);
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

