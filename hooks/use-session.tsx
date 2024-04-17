import { useSession as useNextSession } from 'next-auth/react';

export function useSession() {
  const session = useNextSession();

  if (session.status !== 'authenticated') {
    throw new Error('Unauthenticated');
  }

  return session;
}
