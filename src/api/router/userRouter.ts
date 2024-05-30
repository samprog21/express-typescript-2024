import { Router } from 'express';

import { addUser, getUser, updateUser } from '../controller/userController';

const userRouter = Router();

// Create a new user
userRouter.post('/', addUser);

// Retrieve all users
userRouter.get('/', getUser);

// Retrieve a single user by id
userRouter.get('/:id', getUser);

// Update a user by id
userRouter.put('/:id', updateUser);

// Delete a user by id
//router.delete('/users/:id', UserController.deleteUser);

export { userRouter };
