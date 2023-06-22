import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { handleError } from '../utils';

interface CustomRequest extends Request {
	userId?: string;
}

interface JWTData {
	id: string;
	iat: number;
	exp: number;
}

export const validateJWT = (
	req: CustomRequest,
	res: Response,
	next: NextFunction
) => {
	const { access_token } = req.cookies;
	if (!access_token) return handleError(401, 'Token is required', res);
	try {
		const { id } = jwt.verify(
			access_token,
			process.env.SECRET_KEY!
		) as JWTData;

		req.userId = id;
	} catch (error: any) {
		return handleError(401, error.message, res);
	}
	next();
};
