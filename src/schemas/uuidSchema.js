import z from 'zod';

export const uuidSchema = z.string('The id must be a string').uuid('The id must be a valid UUID');
