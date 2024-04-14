import { PrismaAdapter } from '@auth/prisma-adapter';
import type { UserRole } from '@prisma/client';
import NextAuth from 'next-auth';

import authConfig from '@/auth.config';

import { getAccountByUserId } from './data/account';
import { getTwoFactorConfirmationByUserId } from './data/two-factor-confirmation';
import { getUserById } from './data/user';
import { db } from './lib/db';
import { Routes } from './routes';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  pages: {
    signIn: Routes.auth.login,
    error: Routes.auth.error,
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== 'credentials') return true;

      const existingUser = await getUserById(user.id);

      // Prevent signin if email is not verified
      if (!existingUser?.emailVerified) return false;

      // Check two factor authentication
      if (existingUser?.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser?.id,
        );

        if (!twoFactorConfirmation) return false;

        // Delete 2FA confirmation after successful signin
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }

      return true;
    },
    async session({ token, session }) {
      if (session.user) {
        if (token.sub) {
          session.user.id = token.sub;
        }

        if (token.role) {
          session.user.role = token.role as UserRole;
        }

        session.user.firstname = token.firstname as string;
        session.user.lastname = token.lastname as string;
        session.user.username = token.username as string;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const user = await getUserById(token.sub);

      if (!user) return token;

      const account = await getAccountByUserId(user.id);

      token.isOAuth = !!account;
      token.firstname = user.firstname;
      token.lastname = user.lastname;
      token.username = user.username;
      token.email = user.email;
      token.role = user.role;
      token.isTwoFactorEnabled = user.isTwoFactorEnabled;

      return token;
    },
  },
  ...authConfig,
});
