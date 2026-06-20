import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { sendError } from '../utils/response';

export const validate = (schema: z.Schema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed: any = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      req.body = parsed.body;
      // req.query and req.params might only have getters in some Express environments
      Object.keys(req.query).forEach(k => delete req.query[k]);
      Object.assign(req.query, parsed.query);
      Object.keys(req.params).forEach(k => delete req.params[k]);
      Object.assign(req.params, parsed.params);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Send a formatted validation error message
        const messages = error.issues.map((e: any) => `${e.path.join('.')} : ${e.message}`).join(', ');
        return sendError(res, messages, 400);
      }
      return next(error);
    }
  };
};
