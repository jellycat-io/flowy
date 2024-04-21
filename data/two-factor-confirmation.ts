import { db } from '@/lib/db';

export async function getTwoFactorConfirmationByUserId(userId?: string) {
  if (!userId) return null;

  try {
    return await db.twoFactorConfirmation.findFirst({ where: { userId } });
  } catch (e) {
    console.error('Error getting two factor confirmation by user id', e);
    return null;
  }
}
