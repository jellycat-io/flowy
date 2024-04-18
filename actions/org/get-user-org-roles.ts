'use server';

import { UserRole } from '@prisma/client';
import { z } from 'zod';

import { getOrgsByUserId } from '@/data/org';
import { getUserRoles } from '@/data/user';
import { FetchState, createSafeFetch } from '@/lib/create-safe-fetch';

import { GetUserOrgRolesSchema } from './schemas';

type OrgRole = {
  org: {
    id: string;
    name: string;
  };
  role: UserRole;
};

export type GetUserOrgRolesInput = z.infer<typeof GetUserOrgRolesSchema>;
export type GetUserOrgRolesResponse = FetchState<OrgRole[]>;

async function handler({
  userId,
}: GetUserOrgRolesInput): Promise<GetUserOrgRolesResponse> {
  const orgRoles = await getUserRoles(userId);

  if (!orgRoles) {
    return { error: 'User not found' };
  }

  const orgs = await getOrgsByUserId(userId);

  if (!orgs) {
    return { error: 'Organizations not found' };
  }

  let roles: OrgRole[] = [];

  for (const role of orgRoles) {
    const org = orgs.find((org) => org.id === role.orgId);

    if (!org) {
      return { error: 'Organization not found' };
    }

    roles.push({
      org: {
        id: org.id,
        name: org.name,
      },
      role: role.role,
    });
  }

  return { data: roles };
}

export const getUserOrgRoles = createSafeFetch(handler);
