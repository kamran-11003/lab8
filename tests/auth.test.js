const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const mongoose = require('mongoose');

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
  describe('POST /api/auth/register', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@test.com',
          password: 'password123'
        });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
  });
  describe('POST /api/auth/login', () => {
    it('should login existing user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@test.com',
          password: 'password123'
        });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
  });
});