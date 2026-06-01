const request = require('supertest');
const mongoose = require('mongoose');

// Override environment variables for the comments test suite
process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/eventplanner_test_comments';
process.env.JWT_SECRET = 'comments_test_jwt_secret_key';

const app = require('../server');
const User = require('../models/User');
const Event = require('../models/Event');
const Comment = require('../models/Comment');

let organizerToken;
let attendeeToken;
let otherUserToken;
let testEventId;
let commentIdByAttendee;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({});
  await Event.deleteMany({});
  await Comment.deleteMany({});

  // 1. Create organizer
  const orgRes = await request(app)
    .post('/api/auth/signup')
    .send({
      username: 'comm_org_user',
      email: 'org@example.com',
      password: 'password123',
      role: 'organizer'
    });
  organizerToken = orgRes.body.token;

  // 2. Create attendee
  const attRes = await request(app)
    .post('/api/auth/signup')
    .send({
      username: 'comm_att_user',
      email: 'att@example.com',
      password: 'password123',
      role: 'attendee'
    });
  attendeeToken = attRes.body.token;

  // 3. Create another user (attendee)
  const otherRes = await request(app)
    .post('/api/auth/signup')
    .send({
      username: 'comm_other_user',
      email: 'other@example.com',
      password: 'password123',
      role: 'attendee'
    });
  otherUserToken = otherRes.body.token;

  // 4. Create an event by the organizer
  const eventRes = await request(app)
    .post('/api/events')
    .set('Authorization', `Bearer ${organizerToken}`)
    .send({
      title: 'Discussion Event',
      description: 'Comments test event description',
      date: '2026-09-15',
      time: '18:00',
      location: 'Community Center'
    });
  testEventId = eventRes.body._id;
});

afterAll(async () => {
  try {
    await User.deleteMany({});
    await Event.deleteMany({});
    await Comment.deleteMany({});
  } catch (e) {
    console.error('Error cleaning up collections:', e);
  }
  await mongoose.connection.close();
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

describe('Event Comments & Discussion API', () => {

  it('should deny posting comment if user is not authenticated', async () => {
    const res = await request(app)
      .post(`/api/comments/event/${testEventId}`)
      .send({ text: 'Hello unauthenticated world' });
    
    expect(res.statusCode).toEqual(401);
  });

  it('should post a comment successfully when authenticated', async () => {
    const res = await request(app)
      .post(`/api/comments/event/${testEventId}`)
      .set('Authorization', `Bearer ${attendeeToken}`)
      .send({ text: 'Attendee comment text' });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.text).toEqual('Attendee comment text');
    expect(res.body.user.username).toEqual('comm_att_user');
    
    commentIdByAttendee = res.body._id;
  });

  it('should fetch comments for an event successfully', async () => {
    const res = await request(app)
      .get(`/api/comments/event/${testEventId}`);
    
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].text).toEqual('Attendee comment text');
  });

  it('should block deletion of comments by unauthorized users', async () => {
    const res = await request(app)
      .delete(`/api/comments/${commentIdByAttendee}`)
      .set('Authorization', `Bearer ${otherUserToken}`);
    
    expect(res.statusCode).toEqual(403);
  });

  it('should allow deletion of comments by their author', async () => {
    // Let's post another comment by attendee to delete
    const postRes = await request(app)
      .post(`/api/comments/event/${testEventId}`)
      .set('Authorization', `Bearer ${attendeeToken}`)
      .send({ text: 'Temp comment to delete by author' });
    
    const tempCommentId = postRes.body._id;

    const delRes = await request(app)
      .delete(`/api/comments/${tempCommentId}`)
      .set('Authorization', `Bearer ${attendeeToken}`);
    
    expect(delRes.statusCode).toEqual(200);
  });

  it('should allow deletion of comments by the event organizer', async () => {
    // Organizer deletes the comment that was posted by the attendee
    const res = await request(app)
      .delete(`/api/comments/${commentIdByAttendee}`)
      .set('Authorization', `Bearer ${organizerToken}`);
    
    expect(res.statusCode).toEqual(200);
  });

});
