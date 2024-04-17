'use server';

import { z } from 'zod';

import { getOrgById } from '@/data/org';
import { FetchState, createSafeFetch } from '@/lib/create-safe-fetch';
import { Org } from '@/next-auth';

import { GetOrgSchema } from './schemas';

export type GetOrgInput = z.infer<typeof GetOrgSchema>;
export type GetOrgResponse = FetchState<Org | null>;

async function handler({ orgId }: GetOrgInput): Promise<GetOrgResponse> {
  const org = await getOrgById(orgId);

  return { data: org };
}

export const getOrg = createSafeFetch(handler);
