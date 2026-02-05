import { z } from 'zod';

export const userIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid User ID format'),
  }),
});

export const deleteUserSchema = z.object({
  body: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid User ID format'),
  }),
});
