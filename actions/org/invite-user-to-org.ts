'use server';

import { InvitationStatus } from '@prisma/client';
import { z } from 'zod';

import { getUserByEmail } from '@/data/user';
import { ActionState, createSafeAction } from '@/lib/create-safe-action';
import { db } from '@/lib/db';
import { sendInvitationEmail } from '@/lib/mail';
import { generateInvitationToken } from '@/lib/tokens';

import { InviteUserToOrgSchema } from './schemas';

export type InviteUserToOrgInput = z.infer<typeof InviteUserToOrgSchema>;
export type InviteUserToOrgResponse = {
  success: string;
};

async function handler({
  emails,
  inviterId,
  org,
}: InviteUserToOrgInput): Promise<
  ActionState<InviteUserToOrgInput, InviteUserToOrgResponse>
> {
  let invitees = [];

  for (const email of emails) {
    const existingUser = await getUserByEmail(email);

    // If user already exists, add them to the invitation
    await db.organizationInvitation.create({
      data: {
        email,
        invitedByUserId: inviterId,
        targetUserId: existingUser?.id,
        orgId: org.id,
        status: InvitationStatus.PENDING,
      },
    });

    const invitationToken = await generateInvitationToken(email);

    // Send the invitation email
    await sendInvitationEmail({
      email,
      org,
      token: invitationToken.token,
    });

    invitees.push(email);
  }

  return {
    data: {
      success: `Invitation${invitees.length !== 1 ? 's' : ''} sent to ${invitees.join(', ')}.`,
    },
  };
}

export const inviteUserToOrgAction = createSafeAction(
  InviteUserToOrgSchema,
  handler,
);
