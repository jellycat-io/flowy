import { db } from '@/lib/db';

export async function getUserByEmail(email?: string) {
  if (!email) return null;

  try {
    return await db.user.findUnique({ where: { email } });
  } catch {
    return null;
  }
}

export async function getUserById(id?: string) {
  if (!id) return null;

  try {
    return await db.user.findUnique({ where: { id } });
  } catch {
    return null;
  }
}
