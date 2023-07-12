import { Router } from 'express';
import { getUser, getUsers, removeUser, updateUser } from '../controllers';
import { userExists, validateJWT, validateSchema } from '../middlewares';
import { updateUserSchema, userIdSchema } from '../schemas';
import { multerConfig as multer } from '../utils';

export const usersRouter = Router();

usersRouter.use(validateJWT);

usersRouter.use('/:id', validateSchema(userIdSchema), userExists);

usersRouter.get('/', getUsers);

usersRouter.get('/:id', getUser);

usersRouter.put(
	'/:id',
	validateSchema(updateUserSchema),
	multer.single('avatar'),
	updateUser
);

usersRouter.delete('/:id', removeUser);
