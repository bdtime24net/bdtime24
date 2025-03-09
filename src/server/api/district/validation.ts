import { z } from "zod";

export const districtSchema = z.object({
  name: z.string().min(1, "District name is required"),
  bn_name: z.string().min(1, "Bengali name is required"),
  url: z.string().regex(/^[a-z0-9-]+$/, "URL must be a valid slug (only lowercase letters, numbers, and hyphens)"),
  area: z.number().positive("Area must be a positive number"),
  population: z.number().int().positive("Population must be a positive integer"),
  iso_code: z.string().min(2, "ISO Code is required").max(10, "ISO Code is too long"),
  established: z.number().int().positive("Established year must be a positive integer"),
  divisionId: z.string().min(1, "Division ID is required"),
});

export const districtUpdateSchema = z.object({
  name: z.string().optional(),
  bn_name: z.string().optional(),
  url: z.string().regex(/^[a-z0-9-]+$/, "URL must be a valid slug").optional(),
  area: z.number().positive().optional(),
  population: z.number().int().positive().optional(),
  iso_code: z.string().min(2).max(10).optional(),
  established: z.number().int().positive().optional(),
  divisionId: z.string().optional(),
});
