"use server";

import { isVaultInitialized, initializeVault, verifyVaultPassword } from "@/lib/auth";
import { createSession, destroySession, isSessionValid } from "@/lib/session";
import { setupVaultSchema, unlockVaultSchema } from "@/lib/validations/auth.schema";
import { redirect } from "next/navigation";

export async function checkVaultStatus(): Promise<{ initialized: boolean; unlocked: boolean }> {
  const initialized = await isVaultInitialized();
  const unlocked = await isSessionValid();
  return { initialized, unlocked };
}

export async function setupVault(formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const data = Object.fromEntries(formData.entries());
    const result = setupVaultSchema.safeParse(data);
    
    if (!result.success) {
      return { success: false, error: result.error.issues[0].message };
    }

    await initializeVault(result.data.password);
    await createSession();
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to setup vault";
    return { success: false, error: msg };
  }
}

export async function unlockVault(formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const data = Object.fromEntries(formData.entries());
    const result = unlockVaultSchema.safeParse(data);
    
    if (!result.success) {
      return { success: false, error: result.error.issues[0].message };
    }

    const isValid = await verifyVaultPassword(result.data.password);
    if (!isValid) {
      return { success: false, error: "Incorrect password" };
    }

    await createSession();
    return { success: true };
  } catch {
    return { success: false, error: "Failed to unlock vault" };
  }
}

export async function lockVault(): Promise<void> {
  await destroySession();
  redirect("/login");
}
