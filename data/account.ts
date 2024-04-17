import { db } from '@/lib/db';

export async function getAccountByUserId(userId?: string) {
  if (!userId) return null;

  try {
    return await db.account.findFirst({ where: { userId } });
  } catch (e) {
    console.error('Error getting account by user id', e);
    return null;
  }
}
