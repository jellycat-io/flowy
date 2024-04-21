import { Organization, OrganizationRole } from '@prisma/client';

import { db } from '@/lib/db';

export interface Org extends Organization {
  users: {
    userId: string;
    role: OrganizationRole['role'];
  }[];
}

export async function getOrgById(orgId?: string): Promise<Org | null> {
  if (!orgId) return null;

  try {
    const org = await db.organization.findUnique({
      where: { id: orgId },
      include: {
        users: {
          select: {
            userId: true,
            role: true,
          },
        },
      },
    });

    return org;
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
      include: {
        users: {
          select: {
            userId: true,
            role: true,
          },
        },
      },
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

export async function getOrgsByUserId(userId: string): Promise<Org[] | null> {
  try {
    const orgs = await prisma.organization.findMany({
      where: {
        users: {
          some: {
            userId,
          },
        },
      },
      include: {
        users: {
          select: {
            userId: true,
            role: true,
          },
        },
      },
    });

    return orgs;
  } catch (e) {
    console.error('Error getting orgs by user id', e);
    return null;
  }
}
