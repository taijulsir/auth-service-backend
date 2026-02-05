import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redis from '#config/redis';

// Limit requests to auth endpoints to mitigate brute-force attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes',
  store: new RedisStore({
    // @ts-expect-error - expect ioredis
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
});

export default authLimiter;
