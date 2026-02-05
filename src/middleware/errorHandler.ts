import { NextFunction, Request, Response } from "express";
import logger from "#utils/logger";
import { AppError } from "#utils/AppError";

const errorHandler = (err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = err.message || 'Internal Server Error';

    logger.error(`Error handling ${req.method} ${req.url}`, {
        error: message,
        stack: err.stack,
        method: req.method,
        url: req.url,
        statusCode
    });

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
        // Only show stack in development
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}

export default errorHandler;
