const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/User');

describe('Exam API Routes', () => {
  let adminToken;
  let adminId;

  beforeAll(async () => {
    // Create a mock admin user directly in the DB
    const user = await User.create({
      name: 'Admin Test',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin'
    });
    adminId = user._id;

    // Login to get token
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'password123'
      });
    adminToken = res.body.token;
  });

  afterAll(async () => {
    await User.deleteMany({});
    // Disconnect mongoose if connected
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  it('should allow admin to create an exam', async () => {
    const res = await request(app)
      .post('/api/v1/exams')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Midterm Exam',
        description: 'Testing the API',
        durationMinutes: 60,
        scheduledAt: new Date().toISOString()
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('title', 'Midterm Exam');
  });

  it('should reject unauthorized creation', async () => {
    const res = await request(app)
      .post('/api/v1/exams')
      .send({
        title: 'Hacked Exam'
      });

    expect(res.statusCode).toEqual(401);
  });
});
