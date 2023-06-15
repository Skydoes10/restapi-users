import { NextFunction, Request, Response } from 'express';
import { handleError } from '../utils';

export const validateJWT = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = req.header('access_token');

	if (!token) {
		return handleError(401, 'Token is required', res);
	}
	next();
};
