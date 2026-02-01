import rateLimit from 'express-rate-limit';

// Limit requests to auth endpoints to mitigate brute-force attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

export default authLimiter;
