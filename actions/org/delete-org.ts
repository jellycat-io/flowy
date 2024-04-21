'use server';

import { UserRole } from '@prisma/client';
import { z } from 'zod';

import { get } from 'http';

import { getOrgById } from '@/data/org';
import { getUserById } from '@/data/user';
import { ActionState, createSafeAction } from '@/lib/create-safe-action';
import { db } from '@/lib/db';

import { DeleteOrgSchema } from './schemas';

export type DeleteOrgInput = z.infer<typeof DeleteOrgSchema>;
export type DeleteOrgResponse = {
  success: string;
};

async function handler({
  userId,
  orgId,
}: DeleteOrgInput): Promise<ActionState<DeleteOrgInput, DeleteOrgResponse>> {
  const org = await getOrgById(orgId);

  if (!org) {
    return { error: 'Organization not found' };
  }

  const user = await getUserById(userId);

  if (user?.activeOrgId === orgId) {
    return { error: 'Cannot delete active organization.' };
  }

  if (!user || user.role !== UserRole.OWNER) {
    return { error: 'Unauthorized' };
  }

  await db.organization.delete({
    where: { id: orgId },
  });

  return { data: { success: `Organization ${org.name} deleted!` } };
}

export const deleteOrgAction = createSafeAction(DeleteOrgSchema, handler);
