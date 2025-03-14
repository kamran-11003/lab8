const request = require('supertest');
const app = require('../server');
const Event = require('../models/Event');
const User = require('../models/User');
const mongoose = require('mongoose');
let token;

describe('Events Endpoints', () => {
  beforeAll(async () => {
    await Event.deleteMany({});
    // Create test user and get token
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@events.com',
        password: 'password123'
      });
    token = res.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/events', () => {
    it('should create a new event', async () => {
      const res = await request(app)
        .post('/api/events')
        .set('x-auth-token', token)
        .send({
          title: 'Test Event',
          description: 'Test Description',
          date: new Date(),
          category: 'test',
          reminderTime: new Date()
        });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('title', 'Test Event');
    });
  });

  describe('GET /api/events', () => {
    it('should get all events for user', async () => {
      const res = await request(app)
        .get('/api/events')
        .set('x-auth-token', token);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });
  });
});