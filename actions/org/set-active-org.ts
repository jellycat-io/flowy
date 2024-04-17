'use server';

import { revalidatePath } from 'next/cache';
import * as z from 'zod';

import { auth } from '@/auth';
import { getOrgById } from '@/data/org';
import { getUserRoles } from '@/data/user';
import { ActionState, createSafeAction } from '@/lib/create-safe-action';
import { db } from '@/lib/db';
import { Org } from '@/next-auth';
import { Routes } from '@/routes';

import { SetActiveOrgSchema } from './schemas';

type SetActiveOrgInput = z.infer<typeof SetActiveOrgSchema>;

async function handler({
  orgId,
}: SetActiveOrgInput): Promise<ActionState<SetActiveOrgInput, Org>> {
  const session = await auth();

  if (!session) {
    return { error: 'Unauthorized' };
  }

  try {
    const roles = await getUserRoles(session.user.id);

    const isValidOrg = roles?.some((role) => role.orgId === orgId);

    const org = await getOrgById(orgId);

    if (!isValidOrg) {
      return { error: 'Invalid organization' };
    }

    if (!org) {
      return { error: 'Organization not found' };
    }

    await db.user.update({
      where: { id: session.user.id },
      data: { activeOrgId: orgId },
    });

    revalidatePath(`${Routes.org}/${orgId}`, 'page');

    return { data: org };
  } catch (error) {
    console.error(error);
    return { error: 'Error setting active organization' };
  }
}

export const setActiveOrg = createSafeAction(SetActiveOrgSchema, handler);
