'use server';

import { UserRole } from '@prisma/client';

import { signOut } from '@/auth';
import { getOrgById } from '@/data/org';
import { getUserRoles } from '@/data/user';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';

async function handler() {
  const user = await currentUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  const orgRoles = await getUserRoles(user.id);

  if (!orgRoles) {
    return { error: 'User not found' };
  }

  let ownerRoles = [];

  for (const role of orgRoles) {
    if (role.role === UserRole.OWNER) {
      const org = await getOrgById(role.orgId);

      if (!org) {
        return { error: 'Organization not found' };
      }

      ownerRoles.push(org);
    }
  }

  if (ownerRoles.length > 0) {
    return {
      error: `Your account is currently an owner in these organizations: ${ownerRoles.map((org) => org.name).join(', ')}. Please transfer ownership or delete these organizations before deleting your account.`,
    };
  }

  await signOut();

  await db.user.delete({
    where: { id: user.id },
  });
}

export const deleteAccount = handler;
