import { Router } from 'express';
import { ProductController } from './product.controller.js';
import { productSchema } from './schemas/productSchema.js';
import { validateBody, validatePartialBody } from '../middlewares/validateBody.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const productsRouter = Router();

productsRouter.get('/', asyncHandler(ProductController.getAll));
productsRouter.get('/:id', asyncHandler(ProductController.getById));
productsRouter.get('/:id/related', asyncHandler(ProductController.getRelatedById));
productsRouter.get('/slug/:slug', asyncHandler(ProductController.getBySlug));
productsRouter.get('/slug/:slug/related', asyncHandler(ProductController.getRelatedBySlug));
productsRouter.post('/', validateBody(productSchema), asyncHandler(ProductController.create));
productsRouter.patch('/:id', validatePartialBody(productSchema), asyncHandler(ProductController.update));
productsRouter.put('/:id', validateBody(productSchema), asyncHandler(ProductController.update));
productsRouter.delete('/:id', asyncHandler(ProductController.delete));
