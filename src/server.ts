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

// Import Routes
import apiRoutes from '#routes/index';

import { logRequest } from '#middleware/logMiddleware';
import winstonLogger from '#utils/logger';

const app = express();
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// Winston logging middleware
app.use(logRequest);

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

app.use(errorHandler);

mongoose.connection.once('open', () => {
    app.listen(PORT, () => {
        winstonLogger.info(`Server running on port ${PORT}`);
    });
});
