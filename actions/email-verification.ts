'use server';

import { getUserByEmail } from '@/data/user';
import { getVerificationTokenByToken } from '@/data/verification-token';
import { db } from '@/lib/db';

export async function emailVerification(token: string) {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) return { error: 'Invalid token.' };

  const hasExpired = new Date(existingToken.expiresAt) < new Date();

  if (hasExpired) return { error: 'Token has expired.' };

  const user = await getUserByEmail(existingToken.email);

  if (!user) return { error: 'User not found.' };

  await db.user.update({
    where: { id: user.id },
    data: { emailVerified: new Date(), email: existingToken.email },
  });

  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return {
    success:
      'Thanks for confirming your email! Your account is now fully activated.',
  };
}
