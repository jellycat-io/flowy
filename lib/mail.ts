import { Organization } from '@prisma/client';
import { Resend } from 'resend';

import { Routes } from '@/routes';

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_VERCEL_URL;

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${domain}${Routes.auth.emailVerification}?token=${token}`;

  await resend.emails.send({
    from: 'hello@flowy-app.com',
    to: email,
    subject: 'Confirm your email address',
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email address.</p>`,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${domain}${Routes.auth.resetPassword}?token=${token}`;

  await resend.emails.send({
    from: 'hello@flowy-app.com',
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });
}

export async function sendTwoFactorEmail(email: string, token: string) {
  await resend.emails.send({
    from: 'hello@flowy-app.com',
    to: email,
    subject: 'Two-factor authentication code',
    html: `<p>Your two-factor authentication code is: <strong>${token}</strong></p>`,
  });
}

export async function sendInvitationEmail({
  email,
  org,
  token,
}: {
  email: string;
  org: { id: string; name: string };
  token: string;
}) {
  const invitationLink = `${domain}/org/${org.id}/invitation?token=${token}`;
  await resend.emails.send({
    from: 'hello@flowy-app.com',
    to: email,
    subject: `${org.name} has invited you to join their organization`,
    html: `<p>Click <a href="${invitationLink}">here</a> to accept the invitation.</p>`,
  });
}
