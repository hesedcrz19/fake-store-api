import z from 'zod';
import { SORT_OPTIONS, SORT_ORDER_OPTIONS } from '../const.js';

export const productQuerySchema = z.object({
  title: z.string('The title must be a string').toLowerCase().optional(),
  price: z.coerce
    .number('The price must be a number')
    .positive('The price must be positive')
    .transform((val) => Number(val.toFixed(2)))
    .optional(),
  minPrice: z.coerce
    .number('The minPrice must be a number')
    .positive('The minPrice must be positive')
    .transform((val) => Number(val.toFixed(2)))
    .optional(),
  maxPrice: z.coerce
    .number('The maxPrice must be a number')
    .positive('The maxPrice must be positive')
    .transform((val) => Number(val.toFixed(2)))
    .optional(),
  categoryId: z.string('The categoryId must be a string').uuid('The categoryId must be a valid UUID').optional(),
  categorySlug: z
    .string('The categorySlug must be a string')
    .regex(/^[a-z0-9-]+$/, 'The categorySlug must be a valid slug')
    .optional(),
  sortBy: z
    .enum([SORT_OPTIONS.PRICE, SORT_OPTIONS.TITLE, SORT_OPTIONS.RATING, SORT_OPTIONS.NEWEST], {
      message: 'The sortBy must be either "price", "title", "rating", or "newest"',
    })
    .optional(),
  sortOrder: z
    .enum([SORT_ORDER_OPTIONS.ASC, SORT_ORDER_OPTIONS.DESC], {
      message: 'The sortOrder must be either "asc" or "desc"',
    })
    .optional(),
  discountPercentage: z.coerce
    .number('The discountPercentage must be a number')
    .min(0, 'The discountPercentage must be at least 0')
    .max(100, 'The discountPercentage must be at most 100')
    .transform((val) => Number(val.toFixed(2)))
    .optional(),
  minDiscountPercentage: z.coerce
    .number('The minDiscountPercentage must be a number')
    .min(0, 'The minDiscountPercentage must be at least 0')
    .max(100, 'The minDiscountPercentage must be at most 100')
    .transform((val) => Number(val.toFixed(2)))
    .optional(),
  maxDiscountPercentage: z.coerce
    .number('The maxDiscountPercentage must be a number')
    .min(0, 'The maxDiscountPercentage must be at least 0')
    .max(100, 'The maxDiscountPercentage must be at most 100')
    .transform((val) => Number(val.toFixed(2)))
    .optional(),
  hasDiscount: z
    .enum(['true', 'false'], { message: 'The hasDiscount must be either "true" or "false"' })
    .transform((val) => val === 'true')
    .optional(),
  hasPromotion: z
    .enum(['true', 'false'], { message: 'The hasPromotion must be either "true" or "false"' })
    .transform((val) => val === 'true')
    .optional(),
  freeShipping: z
    .enum(['true', 'false'], { message: 'The freeShipping must be either "true" or "false"' })
    .transform((val) => val === 'true')
    .optional(),
  limit: z.coerce
    .number('The limit must be a number')
    .positive('The limit must be positive')
    .int('The limit must be an integer')
    .optional(),
  offset: z.coerce
    .number('The offset must be a number')
    .nonnegative('The offset must be non-negative')
    .int('The offset must be an integer')
    .optional(),
});
