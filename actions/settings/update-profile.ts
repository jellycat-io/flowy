'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { auth } from '@/auth';
import { getUserByEmail } from '@/data/user';
import { currentUser } from '@/lib/auth';
import { ActionState, createSafeAction } from '@/lib/create-safe-action';
import { db } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/mail';
import { generateVerificationToken } from '@/lib/tokens';

import { UpdateProfileSchema } from './schemas';

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export type UpdateProfileResponse = {
  success: string;
  values?: {
    name: string;
    email: string;
  };
};

async function handler(
  values: UpdateProfileInput,
): Promise<ActionState<UpdateProfileInput, UpdateProfileResponse>> {
  const user = await currentUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  if (user.isOAuth) {
    values.email = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: 'Email already in use' };
    }

    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(values.email, verificationToken.token);

    revalidatePath('/settings');

    return {
      data: { success: 'Email updated. Please verify your new email address.' },
    };
  }

  const newUser = await db.user.update({
    where: { id: user.id },
    data: {
      name: values.name,
      email: values.email,
    },
  });

  revalidatePath('/settings');

  return {
    data: {
      success: 'Profile updated',
      values: {
        name: newUser.name,
        email: newUser.email,
      },
    },
  };
}

export const updateProfileAction = createSafeAction(
  UpdateProfileSchema,
  handler,
);
