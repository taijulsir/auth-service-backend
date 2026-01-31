import { Request, Response, NextFunction } from 'express';
import logger from '#utils/logger.js';

export const logRequest = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    // Log the request when it starts
    logger.info(`Incoming ${req.method} ${req.originalUrl}`, {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
    });

    // Log summary when the request finishes
    res.on('finish', () => {
        const duration = Date.now() - start;
        const { statusCode } = res;

        let level = 'info';
        if (statusCode >= 400) level = 'warn';
        if (statusCode >= 500) level = 'error';

        logger.log(level, `${req.method} ${req.originalUrl} ${statusCode} - ${duration}ms`, {
            method: req.method,
            url: req.originalUrl,
            status: statusCode,
            duration,
        });
    });

    next();
};
