import request from 'supertest';
import express from 'express';
import bcrypt from 'bcrypt';
import User from '../src/models/User';
import { setupTestDB, teardownTestDB, clearTestDB } from './setup';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// Import routes
import consumerRoutes from '../src/routes/v1/consumer';

// Create a minimal test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(cors());
  app.use('/api/v1/consumer', consumerRoutes);
  return app;
};

describe('Auth Integration Tests', () => {
  let app: express.Application;

  beforeAll(async () => {
    // Set required env variables for tests
    process.env.ACCESS_TOKEN_SECRET = 'test-access-secret-key-12345';
    process.env.REFRESH_TOKEN_SECRET = 'test-refresh-secret-key-12345';
    process.env.DATABASE_URI = 'mongodb://localhost:27017/test';
    
    await setupTestDB();
    app = createTestApp();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  describe('POST /api/v1/consumer/auth/login', () => {
    it('should return 400 if email or password is missing', async () => {
      const res = await request(app)
        .post('/api/v1/consumer/auth/login')
        .send({ email: 'test@example.com' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Email and password are required.');
    });

    it('should return 401 for non-existent user', async () => {
      const res = await request(app)
        .post('/api/v1/consumer/auth/login')
        .send({ email: 'nonexistent@example.com', pwd: 'password123' });

      expect(res.status).toBe(401);
    });

    it('should return 401 for incorrect password', async () => {
      // Create a test user
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      await User.create({
        email: 'testuser@example.com',
        password: hashedPassword,
        roles: { User: 2001 },
        refreshToken: [],
      });

      const res = await request(app)
        .post('/api/v1/consumer/auth/login')
        .send({ email: 'testuser@example.com', pwd: 'wrongpassword' });

      expect(res.status).toBe(401);
    });

    it('should successfully login with correct credentials and return accessToken', async () => {
      // Create a test user
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      await User.create({
        email: 'testuser@example.com',
        password: hashedPassword,
        roles: { User: 2001 },
        refreshToken: [],
      });

      const res = await request(app)
        .post('/api/v1/consumer/auth/login')
        .send({ email: 'testuser@example.com', pwd: 'correctpassword' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('roles');
      expect(res.body.roles).toContain(2001);
      
      // Check that refresh token cookie was set
      const cookies = res.headers['set-cookie'] as unknown as string[];
      expect(cookies).toBeDefined();
      expect(Array.isArray(cookies) && cookies.some((cookie: string) => cookie.startsWith('jwt='))).toBe(true);
    });

    it('should store refresh token in database after login', async () => {
      // Create a test user
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = await User.create({
        email: 'testuser@example.com',
        password: hashedPassword,
        roles: { User: 2001 },
        refreshToken: [],
      });

      await request(app)
        .post('/api/v1/consumer/auth/login')
        .send({ email: 'testuser@example.com', pwd: 'password123' });

      const updatedUser = await User.findById(user._id);
      expect(updatedUser?.refreshToken).toHaveLength(1);
      expect(updatedUser?.refreshToken[0]).toBeTruthy();
    });
  });

  describe('GET /api/v1/consumer/auth/refresh', () => {
    it('should return 401 if no refresh token cookie is present', async () => {
      const res = await request(app)
        .get('/api/v1/consumer/auth/refresh');

      expect(res.status).toBe(401);
    });

    it('should successfully refresh token with valid refresh token', async () => {
      // Create and login user first
      const hashedPassword = await bcrypt.hash('password123', 10);
      await User.create({
        email: 'testuser@example.com',
        password: hashedPassword,
        roles: { User: 2001 },
        refreshToken: [],
      });

      // Login to get refresh token
      const loginRes = await request(app)
        .post('/api/v1/consumer/auth/login')
        .send({ email: 'testuser@example.com', pwd: 'password123' });

      const cookies = loginRes.headers['set-cookie'];
      expect(cookies).toBeDefined();

      // Use refresh token to get new access token
      const refreshRes = await request(app)
        .get('/api/v1/consumer/auth/refresh')
        .set('Cookie', cookies);

      expect(refreshRes.status).toBe(200);
      expect(refreshRes.body).toHaveProperty('accessToken');
      expect(refreshRes.body).toHaveProperty('roles');
      expect(refreshRes.body.roles).toContain(2001);
      
      // Check that a new refresh token cookie was set
      const newCookies = refreshRes.headers['set-cookie'] as unknown as string[];
      expect(newCookies).toBeDefined();
      expect(Array.isArray(newCookies) && newCookies.some((cookie: string) => cookie.startsWith('jwt='))).toBe(true);
    });

    it('should store new refresh token in database after refresh', async () => {
      // Create and login user
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = await User.create({
        email: 'testuser@example.com',
        password: hashedPassword,
        roles: { User: 2001 },
        refreshToken: [],
      });

      // Login
      const loginRes = await request(app)
        .post('/api/v1/consumer/auth/login')
        .send({ email: 'testuser@example.com', pwd: 'password123' });

      const cookies = loginRes.headers['set-cookie'];
      
      // Refresh
      const refreshRes = await request(app)
        .get('/api/v1/consumer/auth/refresh')
        .set('Cookie', cookies);

      expect(refreshRes.status).toBe(200);

      // Check that user still has exactly 1 refresh token (old one removed, new one added)
      const updatedUser = await User.findById(user._id);
      expect(updatedUser?.refreshToken).toHaveLength(1);
      expect(updatedUser?.refreshToken[0]).toBeTruthy();
    });
  });
});
