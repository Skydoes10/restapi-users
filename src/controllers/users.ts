import { Request, Response } from 'express';
import User from '../models/user';
import { handleError } from '../utils';
import { updateUser as update } from '../types/user';

export const getUsers = async (req: Request, res: Response) => {
	try {
		const users = await User.find({
			where: { status: true },
			select: ['id', 'username', 'email', 'createdAt'],
		});

		res.json({
			msg: 'getUsers',
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
			where: { id },
			select: ['id', 'username', 'email', 'createdAt'],
		});

		res.json({
			msg: 'getUser',
			user,
		});
	} catch (error: any) {
		handleError(500, error.message, res);
	}
};

export const updateUser = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { username, password }: update = req.body;

	try {
		await User.update(id, { username, password });
		const user = await User.findOne({
			where: { id },
			select: ['id', 'username', 'email', 'createdAt'],
		});

		res.json({
			msg: 'User updated',
			user,
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
			msg: 'User removed',
		});
	} catch (error: any) {
		handleError(500, error.message, res);
	}
};
