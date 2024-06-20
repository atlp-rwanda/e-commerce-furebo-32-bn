import request from "supertest";
import app from "../src/app";
import db from "../src/database/config/database.config";

let token: any;
describe('User Profile Tests', () => {
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
      email: "shyaka@gmail.com",
      password: process.env.TEST_USER_PASS,
      role: "buyer",
      phone: "+13362851038",
    };
    const Res = await request(app).post("/api/users/signup").send(newUser);
    token = Res.body.token;
  });
  afterAll(async () => {
    if (sequelizeInstance) {
      await sequelizeInstance.close();
    }
  });  
  describe('GET /profile', () => {
    test('should return user profile', async () => {

      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`) // Assuming you use Bearer token for auth

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });


  });

describe('PATCH /update-profile', () => {
  test('should update user profile', async () => {
    const updatedData = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '1234567890',
      birthDate: '1990-01-01',
      gender: 'female',
      preferredLanguage: 'English',
      preferredCurrency: 'USD',
      whereYouLive: 'USA',
      billingAddress: '123 Main St',
    };

    const response = await request(app)
      .patch('/api/users/update-profile')
      .set('Authorization', `Bearer ${token}`)
      .field('firstName', updatedData.firstName)
      .field('lastName', updatedData.lastName)
      .field('email', updatedData.email)
      .field('phone', updatedData.phone)
      .field('birthDate', updatedData.birthDate)
      .field('gender', updatedData.gender)
      .field('preferredLanguage', updatedData.preferredLanguage)
      .field('preferredCurrency', updatedData.preferredCurrency)
      .field('whereYouLive', updatedData.whereYouLive)
      .field('billingAddress', updatedData.billingAddress)

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Profile updated successfully');
  });
  });
});