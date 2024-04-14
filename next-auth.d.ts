import type { UserRole } from '@prisma/client';
import type { DefaultSession } from 'next-auth';

export type ExtendedUser = DefaultSession['user'] & {
  firstname: string;
  lastname: string;
  username?: string;
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
};

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser;
  }
}
