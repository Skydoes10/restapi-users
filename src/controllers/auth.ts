import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { z } from 'zod';
import User from '../models/user';
import { loginSchema, registerSchema } from '../schemas';
import { generateJWT, handleError } from '../utils';

export const login = async (req: Request, res: Response) => {
	const { email, password }: z.infer<typeof loginSchema> = req.body;

	try {
		const user = await User.findOne({
			where: { email: email, status: true },
		});

		if (!user) return handleError(404, 'User not found', res);

		const validPassword = await bcrypt.compare(password, user.password);

		if (!validPassword) return handleError(400, 'Invalid password', res);

		const token = await generateJWT({
			id: user.id,
		});

		res.cookie('access_token', token);
		res.json({
			msg: 'Ok',
			user: {
				id: user.id,
				username: user.username,
				email: user.email,
			},
		});
	} catch (error: any) {
		handleError(500, error.message, res);
	}
};

export const register = async (req: Request, res: Response) => {
	const { username, email, password }: z.infer<typeof registerSchema> =
		req.body;

	try {
		const user = User.create({
			username,
			email,
			password,
		});

		user.password = bcrypt.hashSync(user.password, 10);

		await User.save(user);

		const token = await generateJWT({
			id: user.id,
		});

		res.cookie('access_token', token);
		res.json({
			msg: 'Ok',
			user: {
				id: user.id,
				username: user.username,
				email: user.email,
			},
		});
	} catch (error: any) {
		handleError(500, error.message, res);
	}
};

export const logout = (req: Request, res: Response) => {
	res.clearCookie('access_token');
	res.json({
		msg: 'Ok',
	});
};
