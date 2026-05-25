import { Router } from 'express';
import { validateBody, validatePartialBody } from '../middlewares/validateBody.js';
import { categorySchema } from './schemas/categorySchema.js';
import { CategoryController } from './category.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const categoriesRouter = Router();

categoriesRouter.get('/', asyncHandler(CategoryController.getAll));
categoriesRouter.get('/:id', asyncHandler(CategoryController.getById));
categoriesRouter.get('/:id/products', asyncHandler(CategoryController.getProductsByCategoryId));
categoriesRouter.get('/slug/:slug', asyncHandler(CategoryController.getBySlug));
categoriesRouter.get('/slug/:slug/products', asyncHandler(CategoryController.getProductsByCategorySlug));
categoriesRouter.post('/', validateBody(categorySchema), asyncHandler(CategoryController.create));
categoriesRouter.patch('/:id', validatePartialBody(categorySchema), asyncHandler(CategoryController.update));
categoriesRouter.put('/:id', validateBody(categorySchema), asyncHandler(CategoryController.update));
categoriesRouter.delete('/:id', asyncHandler(CategoryController.delete));
