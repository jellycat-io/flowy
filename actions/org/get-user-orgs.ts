'use server';

import { getOrgsByUserId } from '@/data/org';
import { currentUser } from '@/lib/auth';
import { FetchState, createSafeFetch } from '@/lib/create-safe-fetch';
import { Org } from '@/next-auth';

type GetUserOrgsResponse = FetchState<Org[]>;

async function handler(): Promise<GetUserOrgsResponse> {
  const user = await currentUser();

  if (!user?.id) {
    throw new Error('Unauthorized');
  }

  const orgs = await getOrgsByUserId(user.id);

  if (!orgs) {
    throw new Error('Error getting orgs');
  }

  return { data: orgs };
}

export const getUserOrgs = createSafeFetch(handler);
