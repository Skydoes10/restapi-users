import { Router } from 'express';
import { login, logout, register } from '../controllers';
import {
	emailExists,
	usernameExists,
	validateJWT,
	validateSchema,
} from '../middlewares';
import { loginSchema, registerSchema } from '../schemas';

export const authRouter = Router();

authRouter.post('/login', validateSchema(loginSchema), login);

authRouter.post(
	'/register',
	validateSchema(registerSchema),
	emailExists,
	usernameExists,
	register
);

authRouter.use(validateJWT);

authRouter.post('/logout', logout);
