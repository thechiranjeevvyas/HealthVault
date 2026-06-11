import fs from "fs/promises";
import path from "path";

export function getMemberStoragePath(memberId: string): string {
  return path.join(process.cwd(), "uploads", memberId);
}

export async function deleteMemberFiles(memberId: string): Promise<void> {
  try {
    const p = getMemberStoragePath(memberId);
    await fs.rm(p, { recursive: true, force: true });
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error("Failed to delete member files silently:", error);
    }
  }
}
