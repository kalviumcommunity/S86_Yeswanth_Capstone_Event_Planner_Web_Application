const request = require('supertest');
const mongoose = require('mongoose');

// Override environment variables for the test suite
process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/eventplanner_test';
process.env.JWT_SECRET = 'test_jwt_secret_key';

const app = require('../server');
const User = require('../models/User');

beforeAll(async () => {
  // Connect directly to our clean test database
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  // Drop user collections and close connection
  try {
    await User.deleteMany({});
  } catch (e) {
    console.error('Error cleaning up test collection:', e);
  }
  await mongoose.connection.close();
});

beforeEach(async () => {
  // Start each test with a clean user table
  await User.deleteMany({});
  // Reset rate limiting stores between tests to prevent pollution
  if (app.apiLimiter && typeof app.apiLimiter.resetKey === 'function') {
    app.apiLimiter.resetKey('::ffff:127.0.0.1');
    app.apiLimiter.resetKey('127.0.0.1');
  }
  if (app.authLimiter && typeof app.authLimiter.resetKey === 'function') {
    app.authLimiter.resetKey('::ffff:127.0.0.1');
    app.authLimiter.resetKey('127.0.0.1');
  }
});

describe('User Authentication API', () => {
  
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'jest_tester',
        email: 'tester@example.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.username).toEqual('jest_tester');
    expect(res.body.user.email).toEqual('tester@example.com');
  });

  it('should fail registration when email already exists', async () => {
    // Pre-create duplicate user
    await User.create({
      username: 'user_original',
      email: 'duplicate@example.com',
      password: 'password123'
    });

    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'user_new',
        email: 'duplicate@example.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('User already exists');
  });

  it('should login a registered user successfully', async () => {
    // Signup user first
    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'auth_user',
        email: 'auth@example.com',
        password: 'secretpassword'
      });
    expect(signupRes.statusCode).toEqual(201);

    // Login user
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'auth@example.com',
        password: 'secretpassword'
      });
    
    expect(loginRes.statusCode).toEqual(200);
    expect(loginRes.body).toHaveProperty('token');
    expect(loginRes.body.user.username).toEqual('auth_user');
  });

  it('should reject login for non-existent users', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'fake_user@example.com',
        password: 'somepassword'
      });
    
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Invalid credentials');
  });

  it('should reject login with wrong credentials', async () => {
    // Signup user first
    await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'wrong_pwd_user',
        email: 'wrongpwd@example.com',
        password: 'correctpassword'
      });

    // Login with wrong password
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'wrongpwd@example.com',
        password: 'incorrectpassword'
      });
    
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Invalid credentials');
  });
});
