import { useSession } from 'next-auth/react';

export function useActiveUser() {
  const session = useSession();

  return session.data?.user;
}
