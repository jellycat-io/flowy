'use server';

import { auth } from '@/auth';

export async function currentOrg() {
  const session = await auth();

  return session?.activeOrg;
}
