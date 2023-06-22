import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import { handleError } from '../utils';

export const userExists = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params;
	try {
		const user = await User.findOne({
			where: { id, status: true },
		});

		if (!user) return handleError(404, 'User not found', res);

		next();
	} catch (error: any) {
		console.error(error);
		handleError(500, error.message, res);
	}
};

export const emailExists = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({
			where: { email, status: true },
		});

		if (user) return handleError(400, 'Email already exists', res);

		next();
	} catch (error: any) {
		console.error(error);
		handleError(500, error.message, res);
	}
};
