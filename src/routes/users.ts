import { Router } from 'express';
import { getUser, getUsers, removeUser, updateUser } from '../controllers';
import { userExists, validateJWT } from '../middlewares';

export const usersRouter = Router();

usersRouter.use(validateJWT);

usersRouter.get('/', getUsers);

usersRouter.use('/:id', userExists);

usersRouter.get('/:id', getUser);

usersRouter.put('/:id', updateUser);

usersRouter.delete('/:id', removeUser);
