import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { sendError } from '../utils/response';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Send a formatted validation error message
        const messages = error.errors.map((e) => `${e.path.join('.')} : ${e.message}`).join(', ');
        return sendError(res, messages, 400);
      }
      return next(error);
    }
  };
};
