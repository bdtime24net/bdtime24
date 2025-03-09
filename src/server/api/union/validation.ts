import { z } from "zod";

export const unionSchema = z.object({
  name: z.string().min(1, "Union name is required"),
  bn_name: z.string().min(1, "Bengali name is required"),
  url: z.string().regex(/^[a-z0-9-]+$/, "URL must be a valid slug (only lowercase letters, numbers, and hyphens)"),
  upazilaId: z.string().min(1, "Upazila ID is required"),
});

export const unionUpdateSchema = z.object({
  name: z.string().optional(),
  bn_name: z.string().optional(),
  url: z.string().regex(/^[a-z0-9-]+$/, "URL must be a valid slug").optional(),
  upazilaId: z.string().optional(),
});
