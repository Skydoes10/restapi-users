import { Router } from 'express';
import { check } from 'express-validator';
import { login, signUp } from '../controllers';
import { validateFields } from '../middlewares';
import { emailExists } from '../utils';

export const authRouter = Router();

authRouter.post(
	'/login',
	[
		check('email', 'Email is required').isEmail(),
		check('password', 'Password is required').not().isEmpty(),
		validateFields,
	],
	login
);

authRouter.post(
	'/signup',
	[
		check('username', 'Username is required').not().isEmpty(),
		check('email', 'Email is required').isEmail(),
		check('email').custom(emailExists),
		check('password', 'Password is required').not().isEmpty(),
		validateFields,
	],
	signUp
);
