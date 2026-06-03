import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

/**
 * Middleware to validate incoming JSON request payloads against a specific Zod schema
 */
export const validateBody = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate incoming data body asynchronously
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed for incoming payload fields.',
          errors: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      
      return res.status(500).json({ 
        success: false, 
        message: 'Internal parsing or validation schema failure.' 
      });
    }
  };
};