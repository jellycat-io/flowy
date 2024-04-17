import type { UserRole } from '@prisma/client';
import type { DefaultSession } from 'next-auth';

export type Org = {
  id: string;
  name: string;
  premium: boolean;
};

export type ExtendedUser = DefaultSession['user'] & {
  name: string;
  username?: string;
  role: UserRole;
  activeOrgId: string;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
};

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser;
    activeOrg: Org;
  }
}
