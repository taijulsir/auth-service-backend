import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

// Attach a request id to each request to help correlate logs/traces
const requestId = (req: Request, res: Response, next: NextFunction) => {
  const id = (req.headers['x-request-id'] as string) || randomUUID();
  res.setHeader('X-Request-ID', id);
  // attach to request for other middleware that may want it
  (req as any).id = id;
  next();
};

export default requestId;
