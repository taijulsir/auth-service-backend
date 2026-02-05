import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().optional(),
    pwd: z.string().optional(),
  }),
}).refine(data => data.body.email && data.body.pwd, {
  message: 'Email and password are required.',
});

export const registerSchema = z.object({
  body: z.object({
    email: z.string().min(1, 'Email and password are required.').email('Invalid email format'),
    pwd: z.string().min(1, 'Email and password are required.'),
  }),
});
