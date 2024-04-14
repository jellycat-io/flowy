'use server';

import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import * as z from 'zod';

import { signIn } from '@/auth';
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';
import { getUserByEmail } from '@/data/user';
import { db } from '@/lib/db';
import { sendTwoFactorEmail, sendVerificationEmail } from '@/lib/mail';
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from '@/lib/tokens';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { LoginSchema } from '@/schemas';

export async function login(
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null,
) {
  const validated = LoginSchema.safeParse(values);

  if (!validated.success) return { error: 'Invalid credentials.' };

  const { email, password, code } = validated.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: 'User not found.' };
  }

  const passwordsMatch = await bcrypt.compare(password, existingUser.password);

  if (!passwordsMatch) return { error: 'Invalid credentials.' };

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return {
      success:
        'Please confirm your email to log in. Check your inbox for the confirmation link, or click here to resend it.',
    };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken || twoFactorToken.token !== code) {
        return { error: 'Invalid code.' };
      }

      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      const hasExpired = new Date(twoFactorToken.expiresAt) < new Date();

      if (hasExpired) return { error: 'Code has expired.' };

      const confirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id,
      );

      if (confirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: confirmation.id },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);

      await sendTwoFactorEmail(existingUser.email, twoFactorToken.token);

      return { twoFactor: true };
    }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: callbackUrl ?? DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials.' };
        default:
          return { error: 'Something went wrong.' };
      }
    }

    throw error;
  }
}
