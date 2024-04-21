import { Organization } from '@prisma/client';
import { z } from 'zod';

export const SetActiveOrgSchema = z.object({
  orgId: z.string(),
});

export const GetOrgSchema = z.object({
  orgId: z.string(),
});

export const GetUserOrgsSchema = z.object({
  userId: z.string().optional(),
});

export const GetOrgUsersSchema = z.object({
  orgId: z.string(),
});

export const InviteUserToOrgSchema = z.object({
  emails: z.array(z.string()),
  inviterId: z.string(),
  org: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

export const AcceptOrgInvitationSchema = z.object({
  userId: z.string(),
  orgId: z.string(),
});

export const SetOrgUserRoleSchema = z.object({
  orgId: z.string(),
  userId: z.string(),
  role: z.enum(['ADMIN', 'OWNER', 'USER']),
});

export const CreateOrgSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  isActiveOrg: z.boolean().optional(),
});

export const UpdateOrgInfoSchema = z.object({
  orgId: z.string(),
  name: z.string().min(3, 'Name must be at least 3 characters'),
});

export const DeleteOrgSchema = z.object({
  userId: z.string(),
  orgId: z.string(),
});

export const LeaveOrgSchema = z.object({
  userId: z.string(),
  orgId: z.string(),
});
