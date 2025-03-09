import { z } from 'zod'

export const createUserSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});


export const updateUserSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  username: z.string()
});