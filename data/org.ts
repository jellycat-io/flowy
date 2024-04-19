import { OrganizationRole } from '@prisma/client';

import { db } from '@/lib/db';

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

export async function getOrgByName(name?: string) {
  if (!name) return null;

  try {
    return await db.organization.findFirst({
      where: { name },
    });
  } catch (e) {
    console.error('Error getting org by name', e);
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

export type OrgWithRole = {
  id: string;
  name: string;
  premium: boolean;
  nUsers: number;
  role: OrganizationRole['role'];
};

export async function getOrgsByUserId(
  userId: string,
): Promise<OrgWithRole[] | null> {
  try {
    const organizations = await prisma.organizationRole.findMany({
      where: {
        userId: userId,
      },
      include: {
        org: {
          select: {
            id: true,
            name: true,
            premium: true,
            users: true,
          },
        },
      },
    });

    return organizations.map(({ org, ...role }) => ({
      id: org.id,
      name: org.name,
      premium: org.premium,
      nUsers: org.users.length,
      role: role.role,
    }));
  } catch (e) {
    console.error('Error getting orgs by user id', e);
    return null;
  }
}
