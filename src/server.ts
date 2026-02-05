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

let server: any;

mongoose.connection.once('open', () => {
    server = app.listen(PORT, () => {
        winstonLogger.info(`Server running on port ${PORT}`);
    });
});

/**
 * Handle graceful shutdown
 */
const shutdown = async (signal: string) => {
    winstonLogger.info(`${signal} signal received: closing HTTP server...`);
    
    if (server) {
        server.close(() => {
            winstonLogger.info('HTTP server closed.');
        });
    }

    try {
        await mongoose.connection.close(false);
        winstonLogger.info('MongoDB connection closed.');
        process.exit(0);
    } catch (err) {
        winstonLogger.error('Error during shutdown:', err);
        process.exit(1);
    }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
