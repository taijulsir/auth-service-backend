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

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Token is required'),
    pwd: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});
