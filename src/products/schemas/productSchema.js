import z from 'zod';
import { readJSON } from '../../utils/readJSON.js';

const categories = readJSON(import.meta.url, '../../json/categories.json');

const categoriesID = categories.map((category) => category.id);

export const productSchema = z.object(
  {
    title: z
      .string('The title must be a string')
      .trim()
      .superRefine((val, ctx) => {
        if (/\s{2,}/.test(val)) {
          ctx.addIssue({
            code: 'consecutive_spaces',
            message: 'The title must not contain consecutive spaces',
          });
        }
      })
      .min(1, 'The title must have at least 1 characters'),
    description: z
      .string('The description must be a string')
      .trim()
      .min(1, 'The description must have at least 1 characters'),
    originalPrice: z
      .number('The price must be a number')
      .positive('the price must be higger tha 0')
      .superRefine((val, ctx) => {
        if (Number(val.toFixed(2)) !== val) {
          ctx.addIssue({
            code: 'decimals',
            message: 'The price must have at most 2 decimal places',
          });
        }
      }),
    discountPercentage: z
      .number('The discount percentage must be a number')
      .min(0, 'The discount percentage must be a positive number')
      .max(100, 'The discount percentage must be a number between 0 and 100')
      .int('The discount percentage must be an integer'),
    promotion: z
      .enum(['2x1', '3x2'], { message: 'The promotion must be 2x1 or 3x2' })
      .nullable('The promotion can be null'),
    shippingCost: z
      .number('The shipping cost must be a number')
      .min(0, 'The shipping cost must be a positive number')
      .superRefine((val, ctx) => {
        if (Number(val.toFixed(2)) !== val) {
          ctx.addIssue({
            code: 'decimals',
            message: 'The shippingCost must have at most 2 decimal places',
          });
        }
      }),
    rating: z
      .number('The rating must be a number')
      .min(0, 'The rating must be a positive number')
      .max(5, 'The rating must be a number between 0 and 5')
      .superRefine((val, ctx) => {
        if (Number(val.toFixed(1)) !== val) {
          ctx.addIssue({
            code: 'decimals',
            message: 'The rating must have at most 1 decimal place',
          });
        }
      }),
    images: z.array(z.url('The images element must be a valid URL'), 'The images must be an array'),
    categoryId: z.literal(categoriesID, "The category id doesn't exist"),
  },
  'The product must be an object',
);
