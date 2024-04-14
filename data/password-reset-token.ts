import { db } from '@/lib/db';

export async function getPasswordResetTokenByToken(token?: string) {
  if (!token) return null;

  try {
    return await db.passwordResetToken.findUnique({ where: { token } });
  } catch {
    return null;
  }
}

export async function getPasswordResetTokenByEmail(email?: string) {
  if (!email) return null;

  try {
    return await db.passwordResetToken.findFirst({ where: { email } });
  } catch {
    return null;
  }
}
