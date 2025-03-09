import { z } from 'zod';

export const upazilasSchema = z.object({
  name: z.string().min(1, 'Division name is required'),
  bn_name: z.string().min(1, 'Bengali name is required'),
  url: z.string().url('Must be a valid URL'),
});

export const upazilasUpdateSchema = z.object({
  name: z.string().optional(),
  bn_name: z.string().optional(),
  url: z.string().url('Must be a valid URL').optional(),
});
