import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDocumentById } from "@/services/document.service";
import { getFileBuffer } from "@/lib/storage";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const isUnlocked = cookieStore.get("vault_unlocked")?.value === "true";
    if (!isUnlocked) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const doc = await getDocumentById(id);
    if (!doc) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const buffer = await getFileBuffer(doc.filePath);
    
    let mimeType = "application/octet-stream";
    if (doc.fileType === "PDF") mimeType = "application/pdf";
    if (doc.fileType === "JPG") mimeType = "image/jpeg";
    if (doc.fileType === "PNG") mimeType = "image/png";
    if (doc.fileType === "WEBP") mimeType = "image/webp";
    if (doc.fileType === "DOCX") mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `inline; filename="${doc.fileName}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
