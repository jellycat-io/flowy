import { db } from '@/lib/db';

export function getPasswordResetTokenByToken(token: string) {
  try {
    return db.passwordResetToken.findUnique({
      where: { token },
    });
  } catch (e) {
    console.error('Error getting password reset token by token', e);
    return null;
  }
}

export function getPasswordResetTokenByEmail(email: string) {
  try {
    return db.passwordResetToken.findFirst({
      where: { email },
    });
  } catch (e) {
    console.error('Error getting password reset token by email', e);
    return null;
  }
}
