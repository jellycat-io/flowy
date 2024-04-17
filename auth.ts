import { PrismaAdapter } from '@auth/prisma-adapter';
import { UserRole } from '@prisma/client';
import NextAuth from 'next-auth';

import authConfig from '@/auth.config';

import { getAccountByUserId } from './data/account';
import { getOrgRole } from './data/org';
import { getTwoFactorConfirmationByUserId } from './data/two-factor-confirmation';
import { getUserById } from './data/user';
import { db } from './lib/db';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  events: {
    async linkAccount({ user }) {
      if (!user.id) return;

      const orgExists = await db.organizationRole.findFirst({
        where: { userId: user.id },
        include: { org: true },
      });

      if (!orgExists) {
        const org = await db.organization.create({
          data: {
            name: `${user.name}'s Organization`,
            users: {
              create: {
                userId: user.id,
                role: UserRole.OWNER,
              },
            },
          },
        });

        await db.user.update({
          where: { id: user.id },
          data: {
            defaultOrgId: org.id,
            activeOrgId: org.id,
            emailVerified: new Date(),
          },
        });
      } else {
        await db.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() },
        });
      }
    },
  },
  callbacks: {
    async signIn({ user, account }) {
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

        const orgRole = await getOrgRole(
          token.activeOrgId as string,
          session.user.id,
        );

        session.user.role = orgRole?.role as UserRole;
        session.user.name = token.name as string;
        session.user.username = token.username as string;
        session.user.email = token.email as string;
        session.user.activeOrgId = token.activeOrgId as string;
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
      token.name = user.name;
      token.username = user.username;
      token.email = user.email;
      token.activeOrgId = user.activeOrgId;
      token.isTwoFactorEnabled = user.isTwoFactorEnabled;

      return token;
    },
  },
  ...authConfig,
});
