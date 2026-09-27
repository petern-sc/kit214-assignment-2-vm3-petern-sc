import { z } from "zod";

export const RegisterInputSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export type RegisterInput = z.infer<typeof RegisterInputSchema>;

export const LoginRequestSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export type UserRecord = {
  id: string;
  username: string;
  password_hash: string;
};
