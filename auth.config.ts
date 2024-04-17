import bcrypt from 'bcryptjs';
import { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

import { LoginSchema } from '@/actions/auth/schemas';
import { getUserByEmail } from '@/data/user';

import { Routes } from './routes';

export default {
  session: { strategy: 'jwt' },
  pages: {
    signIn: Routes.auth.login,
    error: Routes.auth.error,
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const validated = LoginSchema.safeParse(credentials);

        if (validated.success) {
          const { email, password } = validated.data;
          const user = await getUserByEmail(email);

          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            return user;
          }
        }

        return null;
      },
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
} satisfies NextAuthConfig;
