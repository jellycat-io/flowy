import { db } from '@/lib/db';

export async function getUserByEmail(email?: string) {
  if (!email) return null;

  try {
    return await db.user.findUnique({ where: { email } });
  } catch (e) {
    console.error('Error getting user by email', e);
    return null;
  }
}

export async function getUserById(id?: string) {
  if (!id) return null;

  try {
    return await db.user.findUnique({ where: { id } });
  } catch (e) {
    console.error('Error getting user by id', e);
    return null;
  }
}

export async function getUserRoles(userId?: string) {
  if (!userId) return null;

  try {
    return await db.organizationRole.findMany({
      where: { userId },
    });
  } catch (e) {
    console.error('Error getting user roles', e);
    return [];
  }
}
