import { z } from 'zod'

// Zod schema for creating a user
export const createUserSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
 
});

// Type inference from the Zod schema
export type CreateUserInput = z.infer<typeof createUserSchema>;

// Interface for User model
export interface IUser {
  id: number;
  name: string | null;
  username: string 
}



export const updateUserSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  username: z.string()
});