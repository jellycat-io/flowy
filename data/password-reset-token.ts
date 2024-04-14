import { db } from '@/lib/db';

export function getPasswordResetTokenByToken(token: string) {
  try {
    return db.passwordResetToken.findUnique({
      where: { token },
    });
  } catch {
    return null;
  }
}

export function getPasswordResetTokenByEmail(email: string) {
  try {
    return db.passwordResetToken.findFirst({
      where: { email },
    });
  } catch {
    return null;
  }
}
