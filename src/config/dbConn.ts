import mongoose from 'mongoose';
import logger from '#utils/logger.js';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI!);
        logger.info('MongoDB connected successfully');
    } catch (err: any) {
        logger.error('MongoDB connection error', { error: err.message });
    }
}

export default connectDB;
