import { z } from 'zod';
import { STRINGS } from '@/constants';

/**
 * Zod validation schemas for auth forms
 */

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, STRINGS.AUTH.EMAIL_REQUIRED)
    .email(STRINGS.AUTH.EMAIL_INVALID),
  password: z
    .string()
    .min(1, STRINGS.AUTH.PASSWORD_REQUIRED)
    .min(8, STRINGS.AUTH.PASSWORD_MIN_LENGTH),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, STRINGS.AUTH.NAME_REQUIRED)
      .min(2, STRINGS.AUTH.NAME_MIN_LENGTH),
    email: z
      .string()
      .min(1, STRINGS.AUTH.EMAIL_REQUIRED)
      .email(STRINGS.AUTH.EMAIL_INVALID),
    password: z
      .string()
      .min(1, STRINGS.AUTH.PASSWORD_REQUIRED)
      .min(8, STRINGS.AUTH.PASSWORD_MIN_LENGTH)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        STRINGS.AUTH.PASSWORD_WEAK
      ),
    confirmPassword: z.string().min(1, STRINGS.AUTH.PASSWORD_CONFIRM_REQUIRED),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: STRINGS.AUTH.PASSWORD_MISMATCH,
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
