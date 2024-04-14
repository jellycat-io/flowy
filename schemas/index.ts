import { UserRole } from '@prisma/client';
import * as z from 'zod';

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: 'Password is required' }),
  code: z.string().optional(),
});

export const RegisterSchema = z
  .object({
    firstname: z.string().min(1, { message: 'First name is required' }),
    lastname: z.string().min(1, { message: 'Last name is required' }),
    email: z.string().email(),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password !== data.confirmPassword) {
        return false;
      }

      return true;
    },
    {
      message: 'Passwords must match',
      path: ['confirmPassword'],
    },
  );

export const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string(),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

export const SettingsSchema = z
  .object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
    isTwoFactorEnabled: z.boolean().optional(),
    role: z.enum([UserRole.ADMIN, UserRole.USER]).optional(),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: 'New password is required',
      path: ['newPassword'],
    },
  )
  .refine(
    (data) => {
      if (!data.password && data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: 'Current password is required',
      path: ['password'],
    },
  );
