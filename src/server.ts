import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from '#config/dbConn';
import validateEnv from '#utils/env';
import createApp from './app';
import winstonLogger from '#utils/logger';

const PORT = process.env.PORT || 3500;

// Validate required environment variables before continuing
validateEnv();

// Connect to MongoDB
connectDB();

// Create express app (middlewares & routes configured in src/app.ts)
const app = createApp();

mongoose.connection.once('open', () => {
    app.listen(PORT, () => {
        winstonLogger.info(`Server running on port ${PORT}`);
    });
});
