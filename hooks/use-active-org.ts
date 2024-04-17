import { useSession } from 'next-auth/react';
export function useActiveOrg() {
  const session = useSession();

  return session.data?.activeOrg;
}
