import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { handleError } from '../utils';

export const validateSchema =
	(schema: z.ZodSchema) =>
	(req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse({
				...req.body,
				...req.params,
				...req.file,
			});
			next();
		} catch (error: any) {
			const errors = error.errors.map((err: any) => err.message);
			return handleError(400, errors, res);
		}
	};
