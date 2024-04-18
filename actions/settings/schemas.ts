import { z } from 'zod';

export const UpdateProfileSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
});

export const UpdateAccountSchema = z
  .object({
    password: z.string().optional(),
    newPassword: z.string().optional(),
    confirmNewPassword: z.string().optional(),
    isTwoFactorEnabled: z.boolean().optional(),
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
  )
  .refine(
    ({ newPassword, confirmNewPassword }) => newPassword === confirmNewPassword,
    {
      message: 'Passwords must match',
      path: ['confirmNewPassword'],
    },
  );
