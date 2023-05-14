import { Router } from 'express';
import { check } from 'express-validator';
import { getUser, getUsers, removeUser, updateUser } from '../controllers';
import { validateFields, validateJWT } from '../middlewares';
import { userExists } from '../utils';

export const usersRouter = Router();

usersRouter.use(validateJWT);

usersRouter.use(
	'/:id',
	[
		check('id', 'Id is required').not().isEmpty(),
		check('id').custom(userExists),
		validateFields,
	],
	validateFields
);

usersRouter.get('/', getUsers);

usersRouter.get('/:id', getUser);

usersRouter.put('/:id', updateUser);

usersRouter.delete('/:id', removeUser);
