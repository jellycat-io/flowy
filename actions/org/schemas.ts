import { z } from 'zod';

export const SetActiveOrgSchema = z.object({
  orgId: z.string(),
});

export const GetOrgSchema = z.object({
  orgId: z.string(),
});
