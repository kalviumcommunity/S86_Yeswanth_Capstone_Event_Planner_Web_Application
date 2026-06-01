const request = require('supertest');
const mongoose = require('mongoose');

// Override environment variables for the roles test suite
process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/eventplanner_test_roles';
process.env.JWT_SECRET = 'role_test_jwt_secret_key';

const app = require('../server');
const User = require('../models/User');
const Event = require('../models/Event');

let organizerToken;
let attendeeToken;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({});
  await Event.deleteMany({});

  // Create an organizer account
  const orgRes = await request(app)
    .post('/api/auth/signup')
    .send({
      username: 'role_org_user',
      email: 'org@example.com',
      password: 'password123',
      role: 'organizer'
    });
  organizerToken = orgRes.body.token;

  // Create an attendee account
  const attRes = await request(app)
    .post('/api/auth/signup')
    .send({
      username: 'role_att_user',
      email: 'att@example.com',
      password: 'password123',
      role: 'attendee'
    });
  attendeeToken = attRes.body.token;
});

beforeEach(() => {
  if (app.apiLimiter && typeof app.apiLimiter.resetKey === 'function') {
    app.apiLimiter.resetKey('::ffff:127.0.0.1');
    app.apiLimiter.resetKey('127.0.0.1');
  }
  if (app.authLimiter && typeof app.authLimiter.resetKey === 'function') {
    app.authLimiter.resetKey('::ffff:127.0.0.1');
    app.authLimiter.resetKey('127.0.0.1');
  }
});

afterAll(async () => {
  try {
    await User.deleteMany({});
    await Event.deleteMany({});
  } catch (e) {
    console.error('Error cleaning up collections:', e);
  }
  await mongoose.connection.close();
});

describe('Role-Based Access Control Middleware', () => {

  it('should allow organizers to create events successfully', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${organizerToken}`)
      .send({
        title: 'Grand Concert',
        description: 'Organizer Event creation test',
        date: '2026-08-20',
        time: '19:00',
        location: 'Concert Dome'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body.title).toEqual('Grand Concert');
  });

  it('should prevent attendees from creating events with 403 Forbidden', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${attendeeToken}`)
      .send({
        title: 'Sneaked Event',
        description: 'Attendee Event creation attempt',
        date: '2026-08-20',
        time: '19:00',
        location: 'Secret Dome'
      });
    
    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toEqual('Forbidden: Insufficient permissions');
  });

  it('should prevent attendees from accessing guest lists', async () => {
    const res = await request(app)
      .get('/guests')
      .set('Authorization', `Bearer ${attendeeToken}`);
    
    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toEqual('Forbidden: Insufficient permissions');
  });

  it('should return paginated events if page and limit parameters are provided', async () => {
    const res = await request(app)
      .get('/api/events?page=1&limit=1');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('events');
    expect(res.body).toHaveProperty('totalPages');
    expect(res.body).toHaveProperty('currentPage', 1);
    expect(Array.isArray(res.body.events)).toBe(true);
    expect(res.body.events.length).toBeLessThanOrEqual(1);
  });
});
