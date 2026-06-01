const request = require('supertest');
const mongoose = require('mongoose');

// Override environment variables for the security test suite
process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/eventplanner_test_security';
process.env.JWT_SECRET = 'security_test_jwt_secret_key';

const app = require('../server');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(() => {
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

describe('Security Hardening Checks', () => {

  describe('Helmet HTTP Security Headers', () => {
    it('should include secure HTTP headers from Helmet', async () => {
      const res = await request(app).get('/');
      
      // Helmet headers
      expect(res.headers).toHaveProperty('x-content-type-options', 'nosniff');
      expect(res.headers).toHaveProperty('x-frame-options', 'SAMEORIGIN');
      expect(res.headers).toHaveProperty('x-dns-prefetch-control', 'off');
    });
  });

  describe('Strict CORS Restrictions', () => {
    it('should allow requests from the official frontend origin', async () => {
      const res = await request(app)
        .get('/')
        .set('Origin', 'http://localhost:5173');
      
      expect(res.headers['access-control-allow-origin']).toEqual('http://localhost:5173');
    });

    it('should not reflect unauthorized origin', async () => {
      const res = await request(app)
        .get('/')
        .set('Origin', 'http://hacker-site.com');
      
      expect(res.headers['access-control-allow-origin']).toBeUndefined();
    });
  });

  describe('API Rate Limiting', () => {
    it('should limit request flooding on general /api routes', async () => {
      // In test mode, apiLimiter max is 5
      // Send 5 requests successfully
      for (let i = 0; i < 5; i++) {
        const res = await request(app).get('/api/events');
        // Let's assert these requests aren't rate limited
        expect(res.statusCode).not.toEqual(429);
      }

      // 6th request should fail with 429 Too Many Requests
      const rateLimitedRes = await request(app).get('/api/events');
      expect(rateLimitedRes.statusCode).toEqual(429);
      expect(rateLimitedRes.body.message).toContain('Too many requests');
    });

    it('should enforce stricter limits on auth endpoints', async () => {
      // In test mode, authLimiter max is 3
      // Send 3 requests successfully (can be logins or signups)
      for (let i = 0; i < 3; i++) {
        const res = await request(app)
          .post('/api/auth/login')
          .send({ email: 'nonexistent@example.com', password: 'wrong' });
        
        // Since the user is nonexistent, status is 400, but not 429
        expect(res.statusCode).not.toEqual(429);
      }

      // 4th request should fail with 429 Too Many Requests
      const rateLimitedRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'wrong' });
      
      expect(rateLimitedRes.statusCode).toEqual(429);
      expect(rateLimitedRes.body.message).toContain('Too many login or signup attempts');
    });
  });

});
