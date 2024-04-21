'use server';

import { OrgUser, getUsersByOrgId } from '@/data/user';
import { FetchState, createSafeFetch } from '@/lib/create-safe-fetch';

export type GetOrgUsersInput = {
  orgId: string;
};

export type GetOrgUsersResponse = OrgUser[];

async function handler({
  orgId,
}: GetOrgUsersInput): Promise<FetchState<GetOrgUsersResponse>> {
  const users = await getUsersByOrgId(orgId);

  return { data: users };
}

export const getOrgUsers = createSafeFetch(handler);
