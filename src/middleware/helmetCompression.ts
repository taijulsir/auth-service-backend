import helmet from 'helmet';
import compression from 'compression';
import { RequestHandler } from 'express';

// Export an array of middleware so callers can spread them into app.use
const securityMiddleware: RequestHandler[] = [
  helmet(),
  compression(),
];

export default securityMiddleware;
