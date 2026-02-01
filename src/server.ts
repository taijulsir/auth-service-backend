import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import corsOptions from '#config/corsOptions';
// import { logger } from '#middleware/logEvents';
import errorHandler from '#middleware/errorHandler';
import verifyJWT from '#middleware/verifyJWT';
import cookieParser from 'cookie-parser';
import credentials from '#middleware/credentials';
import mongoose from 'mongoose';
import connectDB from '#config/dbConn';
import securityMiddleware from '#middleware/helmetCompression';
import requestId from '#middleware/requestId';
import healthRoutes from '#routes/health';
import validateEnv from '#utils/env';

// Import Routes
import apiRoutes from '#routes/index';

import { logRequest } from '#middleware/logMiddleware';
import winstonLogger from '#utils/logger';

const app = express();
const PORT = process.env.PORT || 3500;

// Validate required environment variables before continuing
validateEnv();

// Connect to MongoDB
connectDB();

// Winston logging middleware
app.use(logRequest);

// Attach a request id for tracing
app.use(requestId);

// Security middlewares (Helmet, compression)
app.use(...securityMiddleware);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

app.use('/api', apiRoutes);

// Health endpoints
app.use('/health', healthRoutes);

app.use(errorHandler);

mongoose.connection.once('open', () => {
    app.listen(PORT, () => {
        winstonLogger.info(`Server running on port ${PORT}`);
    });
});
