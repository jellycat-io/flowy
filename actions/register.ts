'use server';

import bcrypt from 'bcryptjs';
import * as z from 'zod';

import { getUserByEmail } from '@/data/user';
import { db } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/mail';
import { generateVerificationToken } from '@/lib/tokens';
import { RegisterSchema } from '@/schemas';

export async function register(values: z.infer<typeof RegisterSchema>) {
  const validated = RegisterSchema.safeParse(values);

  if (!validated.success) return { error: 'Invalid credentials.' };

  const { firstname, lastname, email, password } = validated.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) return { error: 'Email already taken.' };

  await db.user.create({
    data: {
      firstname,
      lastname,
      email,
      password: hashedPassword,
    },
  });

  const verificationToken = await generateVerificationToken(email);

  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return {
    success:
      "Welcome aboard! We've sent a confirmation email to your address. Please check your inbox to activate your account.",
  };
}
