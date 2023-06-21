import { Router } from 'express';
import { getUser, getUsers, removeUser, updateUser } from '../controllers';
import { userExists, validateJWT, validateSchema } from '../middlewares';
import { updateUserSchema } from '../schemas';

export const usersRouter = Router();

usersRouter.use(validateJWT);

usersRouter.get('/', getUsers);

usersRouter.use('/:id', userExists);

usersRouter.get('/:id', getUser);

usersRouter.put('/:id', validateSchema(updateUserSchema), updateUser);

usersRouter.delete('/:id', removeUser);
