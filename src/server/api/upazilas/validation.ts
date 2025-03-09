import { z } from 'zod';

export const upazilaSchema = z.object({
  name: z.string().min(1, "Upazila name is required"),
  bn_name: z.string().min(1, "Bengali name is required"),
  url: z.string().regex(/^[a-z0-9-]+$/, "URL must be a valid slug (only lowercase letters, numbers, and hyphens)"),
  districtId: z.string().min(1, "District ID is required"),
});

export const upazilaUpdateSchema = z.object({
  name: z.string().optional(),
  bn_name: z.string().optional(),
  url: z.string().url('Must be a valid URL').optional(),
});
