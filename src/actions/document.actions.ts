"use server";

import { revalidatePath } from "next/cache";
import * as documentService from "@/services/document.service";
import { validateFile, getFileBuffer } from "@/lib/storage";
import { ActionResult, DocumentWithEvent } from "@/types";
import { Document } from "@prisma/client";

export async function uploadDocumentAction(formData: FormData): Promise<ActionResult<Document>> {
  try {
    const file = formData.get("file") as File;
    const memberId = formData.get("memberId") as string;
    const eventId = formData.get("eventId") as string | undefined;

    if (!file || !memberId) {
      return { success: false, error: "Missing required fields" };
    }

    const validation = validateFile({ size: file.size, type: file.type });
    if (!validation.valid) {
      return { success: false, error: validation.error! };
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const document = await documentService.uploadDocument({
      file: buffer,
      originalName: file.name,
      mimeType: file.type,
      fileSize: file.size,
      memberId,
      eventId: eventId || undefined,
    });

    revalidatePath("/documents");
    revalidatePath(`/members/${memberId}`);
    if (eventId) {
      revalidatePath(`/timeline/${eventId}`);
    }

    return { success: true, data: document };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, error: err.message || "Upload failed" };
  }
}

export async function getDocuments(memberId?: string): Promise<ActionResult<DocumentWithEvent[]>> {
  try {
    const docs = await documentService.getAllDocuments(memberId);
    return { success: true, data: docs };
  } catch {
    return { success: false, error: "Failed to fetch documents" };
  }
}

export async function getEventDocuments(eventId: string): Promise<ActionResult<Document[]>> {
  try {
    const docs = await documentService.getDocumentsByEvent(eventId);
    return { success: true, data: docs };
  } catch {
    return { success: false, error: "Failed to fetch event documents" };
  }
}

export async function deleteDocumentAction(id: string): Promise<ActionResult<void>> {
  try {
    const doc = await documentService.getDocumentById(id);
    if (!doc) return { success: false, error: "Not found" };

    await documentService.deleteDocument(id);

    revalidatePath("/documents");
    revalidatePath(`/members/${doc.memberId}`);
    if (doc.eventId) {
      revalidatePath(`/timeline/${doc.eventId}`);
    }

    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Failed to delete document" };
  }
}

export async function serveDocument(id: string): Promise<ActionResult<{ buffer: string; mimeType: string; fileName: string }>> {
  try {
    const doc = await documentService.getDocumentById(id);
    if (!doc) return { success: false, error: "Not found" };

    const buffer = await getFileBuffer(doc.filePath);
    
    let mimeType = "application/octet-stream";
    if (doc.fileType === "PDF") mimeType = "application/pdf";
    if (doc.fileType === "JPG") mimeType = "image/jpeg";
    if (doc.fileType === "PNG") mimeType = "image/png";
    if (doc.fileType === "WEBP") mimeType = "image/webp";
    if (doc.fileType === "DOCX") mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    return { 
      success: true, 
      data: {
        buffer: buffer.toString('base64'),
        mimeType,
        fileName: doc.fileName
      }
    };
  } catch {
    return { success: false, error: "Failed to load document" };
  }
}
