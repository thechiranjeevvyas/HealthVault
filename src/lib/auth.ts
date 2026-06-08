import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function isVaultInitialized(): Promise<boolean> {
  const settings = await db.vaultSettings.findFirst();
  return !!settings?.passwordHash;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function initializeVault(password: string): Promise<void> {
  const existing = await db.vaultSettings.findFirst();
  if (existing) {
    throw new Error("Vault is already initialized");
  }
  const passwordHash = await hashPassword(password);
  await db.vaultSettings.create({
    data: {
      passwordHash,
    },
  });
}

export async function verifyVaultPassword(password: string): Promise<boolean> {
  const settings = await db.vaultSettings.findFirst();
  if (!settings) return false;
  return bcrypt.compare(password, settings.passwordHash);
}
