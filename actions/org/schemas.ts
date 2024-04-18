import { z } from 'zod';

export const SetActiveOrgSchema = z.object({
  orgId: z.string(),
});

export const GetOrgSchema = z.object({
  orgId: z.string(),
});

export const CreateOrgSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  isActiveOrg: z.boolean().optional(),
});

export const GetUserOrgRolesSchema = z.object({
  userId: z.string(),
});
