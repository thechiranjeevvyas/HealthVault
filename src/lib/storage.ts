import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const UPLOAD_BASE_DIR = "./uploads";
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const ALLOWED_TYPES: Record<string, string> = {
  "application/pdf": "PDF",
  "image/jpeg": "JPG",
  "image/png": "PNG",
  "image/webp": "WEBP",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
};

export async function ensureUploadDirs(memberId: string, eventId?: string): Promise<void> {
  let targetPath = path.join(process.cwd(), UPLOAD_BASE_DIR, memberId);
  if (eventId) {
    targetPath = path.join(targetPath, eventId);
  }
  await fs.mkdir(targetPath, { recursive: true });
}

export async function saveFile(params: {
  file: Buffer;
  originalName: string;
  memberId: string;
  eventId?: string;
  mimeType: string;
}): Promise<{ filePath: string; fileName: string }> {
  await ensureUploadDirs(params.memberId, params.eventId);

  const sanitizedName = params.originalName.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const uniqueName = `${Date.now()}_${uuidv4().slice(0, 8)}_${sanitizedName}`;
  
  let relativePath = `${params.memberId}/${uniqueName}`;
  if (params.eventId) {
    relativePath = `${params.memberId}/${params.eventId}/${uniqueName}`;
  }

  const absolutePath = path.join(process.cwd(), UPLOAD_BASE_DIR, relativePath);
  await fs.writeFile(absolutePath, params.file);

  return { filePath: relativePath, fileName: params.originalName };
}

export async function deleteFile(filePath: string): Promise<void> {
  const absolutePath = path.join(process.cwd(), UPLOAD_BASE_DIR, filePath);
  try {
    await fs.unlink(absolutePath);
  } catch (error: unknown) {
    const err = error as NodeJS.ErrnoException;
    if (err.code !== "ENOENT") throw err;
  }
}

export async function deleteEventFiles(memberId: string, eventId: string): Promise<void> {
  const absolutePath = path.join(process.cwd(), UPLOAD_BASE_DIR, memberId, eventId);
  try {
    await fs.rm(absolutePath, { recursive: true, force: true });
  } catch (error: unknown) {
    const err = error as NodeJS.ErrnoException;
    if (err.code !== "ENOENT") throw err;
  }
}

export async function deleteMemberFiles(memberId: string): Promise<void> {
  const absolutePath = path.join(process.cwd(), UPLOAD_BASE_DIR, memberId);
  try {
    await fs.rm(absolutePath, { recursive: true, force: true });
  } catch (error: unknown) {
    const err = error as NodeJS.ErrnoException;
    if (err.code !== "ENOENT") throw err;
  }
}

export async function getFileBuffer(filePath: string): Promise<Buffer> {
  const absolutePath = path.join(process.cwd(), UPLOAD_BASE_DIR, filePath);
  return fs.readFile(absolutePath);
}

export function validateFile(file: { size: number; type: string }): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "File exceeds maximum size of 50MB" };
  }
  if (!ALLOWED_TYPES[file.type]) {
    return { valid: false, error: "Invalid file type. Supported types: PDF, JPG, PNG, WEBP, DOCX" };
  }
  return { valid: true };
}
