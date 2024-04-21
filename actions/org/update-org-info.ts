'use server';

import { z } from 'zod';

import { getOrgById } from '@/data/org';
import { ActionState, createSafeAction } from '@/lib/create-safe-action';
import { db } from '@/lib/db';

import { UpdateOrgInfoSchema } from './schemas';

export type UpdateOrgInfoInput = z.infer<typeof UpdateOrgInfoSchema>;
export type UpdateOrgInfoResponse = {
  orgId: string;
};

async function handler({
  orgId,
  name,
}: UpdateOrgInfoInput): Promise<
  ActionState<UpdateOrgInfoInput, UpdateOrgInfoResponse>
> {
  const existingOrg = await getOrgById(orgId);

  if (!existingOrg) {
    return { error: 'Organization not found' };
  }

  const updatedOrg = await db.organization.update({
    where: { id: orgId },
    data: { name },
  });

  return {
    data: {
      orgId: updatedOrg.id,
    },
  };
}

export const updateOrgInfoAction = createSafeAction(
  UpdateOrgInfoSchema,
  handler,
);
