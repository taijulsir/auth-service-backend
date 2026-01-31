import { NextFunction, Request, Response } from "express";
import logger from "#utils/logger.js";

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(`Error handling ${req.method} ${req.url}`, {
        error: err.message,
        stack: err.stack,
        method: req.method,
        url: req.url,
    });
    res.status(500).send(err.message);
}

export default errorHandler;
