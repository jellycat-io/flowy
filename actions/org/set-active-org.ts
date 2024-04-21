'use server';

import { revalidatePath } from 'next/cache';
import * as z from 'zod';

import { auth } from '@/auth';
import { Org, getOrgsByUserId } from '@/data/org';
import { ActionState, createSafeAction } from '@/lib/create-safe-action';
import { db } from '@/lib/db';
import { Routes } from '@/routes';

import { SetActiveOrgSchema } from './schemas';

type SetActiveOrgInput = z.infer<typeof SetActiveOrgSchema>;
type SetActiveOrgResponse = Org;

async function handler({
  orgId,
}: SetActiveOrgInput): Promise<ActionState<SetActiveOrgInput, Org>> {
  const session = await auth();

  if (!session?.user.id) {
    return { error: 'Unauthorized' };
  }

  try {
    const orgs = await getOrgsByUserId(session.user.id);

    const org = orgs?.find((org) => org.id === orgId);

    if (!org) {
      return { error: 'Invalid organization' };
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

export const setActiveOrgAction = createSafeAction(SetActiveOrgSchema, handler);
