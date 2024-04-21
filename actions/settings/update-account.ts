'use server';

import bcrypt from 'bcryptjs';
import { z } from 'zod';

import { getUserById } from '@/data/user';
import { currentUser } from '@/lib/auth';
import { ActionState, createSafeAction } from '@/lib/create-safe-action';
import { db } from '@/lib/db';

import { UpdateAccountSchema } from './schemas';

export type UpdateAccountInput = z.infer<typeof UpdateAccountSchema>;
export type UpdateAccountResponse = {
  success: string;
  values: {
    isTwoFactorEnabled: boolean;
  };
};

async function handler(
  values: UpdateAccountInput,
): Promise<ActionState<UpdateAccountInput, UpdateAccountResponse>> {
  const user = await currentUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  if (user.isOAuth) {
    values.password = undefined;
    values.newPassword = undefined;
    values.confirmNewPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: 'User not found' };
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordMatch = await bcrypt.compare(
      values.password,
      dbUser.password,
    );

    if (!passwordMatch) {
      return { error: 'Invalid password' };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);

    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  const newUser = await db.user.update({
    where: { id: user.id },
    data: {
      password: values.password,
      isTwoFactorEnabled: values.isTwoFactorEnabled,
    },
  });

  return {
    data: {
      success: 'Account updated!',
      values: {
        isTwoFactorEnabled: newUser.isTwoFactorEnabled,
      },
    },
  };
}

export const updateAccountAction = createSafeAction(
  UpdateAccountSchema,
  handler,
);
