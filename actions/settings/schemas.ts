import { z } from 'zod';

export const UpdateProfileSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
});
