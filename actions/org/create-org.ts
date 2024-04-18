'use server';

import { UserRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { getSession } from 'next-auth/react';
import { z } from 'zod';

import { auth } from '@/auth';
import { getOrgByName } from '@/data/org';
import { ActionState, createSafeAction } from '@/lib/create-safe-action';
import { db } from '@/lib/db';
import { Org } from '@/next-auth';

import { CreateOrgSchema } from './schemas';

export type CreateOrgInput = z.infer<typeof CreateOrgSchema>;
export type CreateOrgResponse = {
  org: Org;
  setAsActive: boolean;
};

async function handler({
  name,
  isActiveOrg,
}: CreateOrgInput): Promise<ActionState<CreateOrgInput, CreateOrgResponse>> {
  const session = await auth();

  if (!session?.user.id) {
    return { error: 'Unauthorized' };
  }

  try {
    const org = await db.organization.create({
      data: {
        name,
        users: {
          create: {
            userId: session.user.id,
            role: UserRole.OWNER,
          },
        },
      },
    });

    if (isActiveOrg) {
      await db.user.update({
        where: { id: session.user.id },
        data: { activeOrgId: org.id },
      });

      revalidatePath(`/org/${org.id}`, 'page');
    }
    return {
      data: {
        org: org,
        setAsActive: !!isActiveOrg,
      },
    };
  } catch (error) {
    console.error(error);
    return { error: 'Error creating organization' };
  }
}

export const createOrg = createSafeAction(CreateOrgSchema, handler);
