'use server';

import { UserRole } from '@prisma/client';
import { z } from 'zod';

import { signOut } from '@/auth';
import { getOrgById } from '@/data/org';
import { getUserRoles } from '@/data/user';
import { ActionState, createSafeAction } from '@/lib/create-safe-action';
import { db } from '@/lib/db';

import { DeleteAccountSchema } from './schemas';

export type DeleteAccountInput = z.infer<typeof DeleteAccountSchema>;
export type DeleteAccountResponse = {
  userId: string;
};

async function handler({
  userId,
}: DeleteAccountInput): Promise<
  ActionState<DeleteAccountInput, DeleteAccountResponse>
> {
  const orgRoles = await getUserRoles(userId);

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
      error: `This account is currently an owner in these organizations: ${ownerRoles.map((org) => org.name).join(', ')}. Please transfer ownership or delete these organizations before deleting this account.`,
    };
  }

  await signOut();

  const deleteUser = await db.user.delete({
    where: { id: userId },
  });

  return {
    data: {
      userId: deleteUser.id,
    },
  };
}

export const deleteAccountAction = createSafeAction(
  DeleteAccountSchema,
  handler,
);
