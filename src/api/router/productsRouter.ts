import { Router } from 'express';

import upload from '../../common/middleware/imageUploader';
import { addProduct, getProduct, listProducts, updateProduct } from '../controller/productsController';

const productsRouter = Router();

// Create a new user
productsRouter.post('/', upload.single('image'), addProduct);

// Retrieve all users
productsRouter.get('/', listProducts);

// Retrieve a single user by id
productsRouter.get('/:id', getProduct);

// Update a user by id
productsRouter.patch('/:id', upload.single('image'), updateProduct);

// Delete a user by id
//router.delete('/users/:id', UserController.deleteUser);

export { productsRouter };
