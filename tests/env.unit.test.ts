import { validateEnv } from '../src/utils/env';

describe('Environment Validation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment before each test
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  it('should pass when all required env variables are present', () => {
    process.env.DATABASE_URI = 'mongodb://localhost:27017/test';
    process.env.ACCESS_TOKEN_SECRET = 'test-access-secret';
    process.env.REFRESH_TOKEN_SECRET = 'test-refresh-secret';

    expect(() => validateEnv()).not.toThrow();
  });

  it('should throw error when DATABASE_URI is missing', () => {
    delete process.env.DATABASE_URI;
    process.env.ACCESS_TOKEN_SECRET = 'test-access-secret';
    process.env.REFRESH_TOKEN_SECRET = 'test-refresh-secret';

    expect(() => validateEnv()).toThrow('Missing required environment variables: DATABASE_URI');
  });

  it('should throw error when ACCESS_TOKEN_SECRET is missing', () => {
    process.env.DATABASE_URI = 'mongodb://localhost:27017/test';
    delete process.env.ACCESS_TOKEN_SECRET;
    process.env.REFRESH_TOKEN_SECRET = 'test-refresh-secret';

    expect(() => validateEnv()).toThrow('Missing required environment variables: ACCESS_TOKEN_SECRET');
  });

  it('should throw error when multiple env variables are missing', () => {
    delete process.env.DATABASE_URI;
    delete process.env.ACCESS_TOKEN_SECRET;
    process.env.REFRESH_TOKEN_SECRET = 'test-refresh-secret';

    expect(() => validateEnv()).toThrow('Missing required environment variables: DATABASE_URI, ACCESS_TOKEN_SECRET');
  });

  it('should throw error when all env variables are missing', () => {
    delete process.env.DATABASE_URI;
    delete process.env.ACCESS_TOKEN_SECRET;
    delete process.env.REFRESH_TOKEN_SECRET;

    expect(() => validateEnv()).toThrow('Missing required environment variables');
  });
});
