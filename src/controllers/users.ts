import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { z } from 'zod';
import User from '../models/user';
import { updateUserSchema } from '../schemas';
import { handleError } from '../utils';

export const getUsers = async (req: Request, res: Response) => {
	try {
		const users = await User.find({
			where: { status: true },
			select: ['id', 'username', 'email'],
		});

		res.json({
			msg: 'Ok',
			users,
		});
	} catch (error: any) {
		handleError(500, error.message, res);
	}
};

export const getUser = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const user = await User.findOne({
			where: { id, status: true },
			select: ['id', 'username', 'email'],
		});

		res.json({
			msg: 'Ok',
			user,
		});
	} catch (error: any) {
		handleError(500, error.message, res);
	}
};

export const updateUser = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { username, password }: z.infer<typeof updateUserSchema> = req.body;

	try {
		const user = await User.findOne({
			where: { id, status: true },
		});

		if (password) {
			const isPasswordValid = await bcrypt.compare(
				password,
				user!.password
			);

			if (isPasswordValid) {
				return handleError(400, 'Password is invalid', res);
			}

			const salt = await bcrypt.genSalt(10);
			const newPassword = await bcrypt.hash(password, salt);

			await User.update(id, { password: newPassword });
		}

		if (username) {
			const isUsernameInUse = await User.findOne({
				where: { username },
			});

			if (isUsernameInUse) {
				return handleError(400, 'Username is already in use', res);
			}

			await User.update(id, { username });
		}

		const userUpdated = await User.findOne({
			where: { id },
			select: ['id', 'username', 'email'],
		});

		res.json({
			msg: 'Ok',
			user: userUpdated,
		});
	} catch (error: any) {
		handleError(500, error.message, res);
	}
};

export const removeUser = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		await User.update(id, { status: false });

		res.json({
			msg: 'Ok',
		});
	} catch (error: any) {
		handleError(500, error.message, res);
	}
};
