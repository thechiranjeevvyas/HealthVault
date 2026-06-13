import { db } from "@/lib/db";
import { Document } from "@prisma/client";
import { validateFile, saveFile, deleteFile, ALLOWED_TYPES } from "@/lib/storage";
import { DocumentWithEvent } from "@/types";

export async function uploadDocument(params: {
  file: Buffer;
  originalName: string;
  mimeType: string;
  fileSize: number;
  memberId: string;
  eventId?: string;
}): Promise<Document> {
  const validation = validateFile({ size: params.fileSize, type: params.mimeType });
  if (!validation.valid) throw new Error(validation.error);

  const { filePath, fileName } = await saveFile({
    file: params.file,
    originalName: params.originalName,
    memberId: params.memberId,
    eventId: params.eventId,
    mimeType: params.mimeType,
  });

  const fileType = ALLOWED_TYPES[params.mimeType];

  return db.document.create({
    data: {
      fileName,
      filePath,
      fileType,
      fileSize: params.fileSize,
      memberId: params.memberId,
      eventId: params.eventId,
    }
  });
}

export async function getDocumentsByMember(memberId: string): Promise<DocumentWithEvent[]> {
  return db.document.findMany({
    where: { memberId },
    orderBy: { uploadedAt: 'desc' },
    include: {
      event: {
        select: { id: true, title: true, type: true, date: true }
      },
      member: true
    }
  }) as unknown as Promise<DocumentWithEvent[]>;
}

export async function getDocumentsByEvent(eventId: string): Promise<Document[]> {
  return db.document.findMany({
    where: { eventId },
    orderBy: { uploadedAt: 'asc' }
  });
}

export async function getDocumentById(id: string): Promise<Document | null> {
  return db.document.findUnique({ where: { id } });
}

export async function deleteDocument(id: string): Promise<void> {
  const doc = await db.document.findUnique({ where: { id } });
  if (!doc) return;

  await deleteFile(doc.filePath);
  await db.document.delete({ where: { id } });
}

export async function getAllDocuments(memberId?: string): Promise<DocumentWithEvent[]> {
  const where = memberId ? { memberId } : {};
  return db.document.findMany({
    where,
    orderBy: { uploadedAt: 'desc' },
    include: {
      event: {
        select: { id: true, title: true, type: true, date: true }
      },
      member: true,
    }
  }) as unknown as Promise<DocumentWithEvent[]>;
}

export async function getDocumentStats(): Promise<{
  totalCount: number;
  totalSize: number;
  byType: Record<string, number>;
}> {
  const [totalCount, sizeResult, typeGroups] = await Promise.all([
    db.document.count(),
    db.document.aggregate({ _sum: { fileSize: true } }),
    db.document.groupBy({ by: ['fileType'], _count: true })
  ]);

  const byType: Record<string, number> = {};
  typeGroups.forEach(group => {
    byType[group.fileType] = group._count;
  });

  return {
    totalCount,
    totalSize: sizeResult._sum.fileSize || 0,
    byType
  };
}
