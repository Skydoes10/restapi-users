import { z } from 'zod';

export const loginSchema = z.object({
	email: z
		.string({
			required_error: 'Email is required',
		})
		.email({
			message: 'Invalid email',
		}),
	password: z
		.string({
			required_error: 'Password is required',
		})
		.min(6, {
			message: 'Password must be at least 6 characters',
		})
		.max(100, {
			message: 'Password must be at most 100 characters',
		}),
});

export const registerSchema = z.object({
	username: z
		.string({
			required_error: 'Username is required',
		})
		.min(3, {
			message: 'Username must be at least 3 characters',
		})
		.max(100, {
			message: 'Username must be at most 100 characters',
		}),
	email: z
		.string({
			required_error: 'Email is required',
		})
		.email({
			message: 'Invalid email',
		}),
	password: z
		.string({
			required_error: 'Password is required',
		})
		.min(6, {
			message: 'Password must be at least 6 characters',
		})
		.max(100, {
			message: 'Password must be at most 100 characters',
		}),
});
