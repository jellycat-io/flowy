import { db } from '@/lib/db';
import { Org } from '@/next-auth';

export async function getOrgById(orgId?: string) {
  if (!orgId) return null;

  try {
    return await db.organization.findUnique({
      where: { id: orgId },
    });
  } catch (e) {
    console.error('Error getting org by id', e);
    return null;
  }
}

export async function getOrgRole(orgId: string, userId: string) {
  try {
    return await db.organizationRole.findFirst({
      where: { orgId, userId },
    });
  } catch (e) {
    return null;
  }
}

export async function getOrgsByUserId(userId: string): Promise<Org[] | null> {
  try {
    const role = await db.organizationRole.findMany({
      where: { userId },
      include: { org: true },
    });

    return role.map((r) => r.org);
  } catch (e) {
    console.error('Error getting orgs by user id', e);
    return null;
  }
}
