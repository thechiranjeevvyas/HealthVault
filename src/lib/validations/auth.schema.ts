import { z } from "zod";

export const setupVaultSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/\d/, "Password must contain at least 1 number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const unlockVaultSchema = z.object({
  password: z.string().min(1, "Password is required"),
});
