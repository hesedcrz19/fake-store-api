import z from 'zod'

export const slugSchema = z.string('The slug must be a string').regex(/^[a-z0-9-]+$/, 'The slug must be a valid slug')
