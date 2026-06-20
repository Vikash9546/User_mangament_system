import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { sendError } from '../utils/response';
import { sanitizeSensitiveData } from '../utils/logSanitizer';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const sanitizedBody = sanitizeSensitiveData(req.body);
  logger.error(`Error processing request: ${err.message}`, { stack: err.stack, path: req.path, body: sanitizedBody });

  // Handle specific known errors (could expand this further)
  if (err.name === 'NotFoundError') {
    return sendError(res, err.message || 'Resource not found', 404);
  }

  if (err.name === 'ValidationError') {
    return sendError(res, err.message || 'Validation failed', 400);
  }

  // Generic internal server error, avoiding leaking stack traces
  return sendError(res, 'Internal server error', 500);
};
