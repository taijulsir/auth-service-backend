import express from 'express';
import cors from 'cors';
import corsOptions from '#config/corsOptions';
import errorHandler from '#middleware/errorHandler';
import cookieParser from 'cookie-parser';
import credentials from '#middleware/credentials';
import securityMiddleware from '#middleware/helmetCompression';
import requestId from '#middleware/requestId';
import healthRoutes from '#routes/health';
import apiRoutes from '#routes/index';
import { logRequest } from '#middleware/logMiddleware';

import { setupSwagger } from '#config/swagger';
import configurePassport from '#config/passport';
import passport from 'passport';

const createApp = () => {
  const app = express();

  // Initialize Passport
  configurePassport();
  app.use(passport.initialize());

  // Swagger Documentation
  setupSwagger(app as any);

  // Request logging
  app.use(logRequest);

  // Attach a request id for tracing
  app.use(requestId);

  // Security middlewares (Helmet, compression)
  app.use(...securityMiddleware);

  // Handle options credentials check - before CORS!
  app.use(credentials);

  // Cross Origin Resource Sharing
  app.use(cors(corsOptions));

  // built-in middleware to handle urlencoded form data
  app.use(express.urlencoded({ extended: false }));

  // built-in middleware for json
  app.use(express.json());

  // middleware for cookies
  app.use(cookieParser());

  // API routes
  app.use('/api', apiRoutes);

  // Health endpoints
  app.use('/health', healthRoutes);

  // Global error handler
  app.use(errorHandler);

  return app;
};

export default createApp;
