'use server';

import { z } from 'zod';

import { OrgWithRole, getOrgsByUserId } from '@/data/org';
import { FetchState, createSafeFetch } from '@/lib/create-safe-fetch';

import { GetUserOrgsSchema } from './schemas';

export type GetUserOrgsInput = z.infer<typeof GetUserOrgsSchema>;
export type GetUserOrgsResponse = FetchState<OrgWithRole[]>;

async function handler({
  userId,
}: GetUserOrgsInput): Promise<GetUserOrgsResponse> {
  const orgs = await getOrgsByUserId(userId);

  if (!orgs) {
    return { error: 'Organizations not found' };
  }

  return { data: orgs };
}

export const getUserOrgs = createSafeFetch(handler);
