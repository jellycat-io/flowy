import { db } from '@/lib/db';

export type OrgUser = {
  id: string;
  email: string;
  name: string;
  image: string | null;
  role: string;
};

export async function getUsersByOrgId(orgId: string): Promise<OrgUser[]> {
  try {
    const users = await db.user.findMany({
      where: {
        orgRoles: {
          some: {
            orgId: orgId,
          },
        },
      },
      include: {
        orgRoles: {
          select: {
            orgId: true,
            role: true,
          },
        },
      },
    });

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      role: user.orgRoles.find((r) => r.orgId === orgId)?.role!,
    }));
  } catch (e) {
    console.error('Error getting users by org id', e);
    return [];
  }
}

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
