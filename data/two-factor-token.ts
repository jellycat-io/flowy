import { db } from '@/lib/db';

export async function getTwoFactorTokenByToken(token?: string) {
  if (!token) return null;

  try {
    return await db.twoFactorToken.findUnique({ where: { token } });
  } catch (e) {
    console.error('Error getting two factor token by token', e);
    return null;
  }
}

export async function getTwoFactorTokenByEmail(email?: string) {
  if (!email) return null;

  try {
    return await db.twoFactorToken.findFirst({ where: { email } });
  } catch (e) {
    console.error('Error getting two factor token by email', e);
    return null;
  }
}
