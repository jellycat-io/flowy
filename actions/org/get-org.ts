'use server';

import { z } from 'zod';

import { Org, getOrgById } from '@/data/org';
import { FetchState, createSafeFetch } from '@/lib/create-safe-fetch';

import { GetOrgSchema } from './schemas';

export type GetOrgInput = z.infer<typeof GetOrgSchema>;
export type GetOrgResponse = FetchState<Org>;

async function handler({ orgId }: GetOrgInput): Promise<GetOrgResponse> {
  const org = await getOrgById(orgId);

  if (!org) {
    return { error: 'Organization not found' };
  }

  return { data: org };
}

export const getOrg = createSafeFetch(handler);
