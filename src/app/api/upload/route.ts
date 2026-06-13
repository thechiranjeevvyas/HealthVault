import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { uploadDocument } from "@/services/document.service";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const isUnlocked = cookieStore.get("vault_unlocked")?.value === "true";
    if (!isUnlocked) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const memberId = formData.get("memberId") as string;
    const eventId = formData.get("eventId") as string | null;

    if (!file || !memberId) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    const document = await uploadDocument({
      file: buffer,
      originalName: file.name,
      mimeType: file.type,
      fileSize: file.size,
      memberId,
      eventId: eventId || undefined,
    });

    return NextResponse.json({ success: true, document });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
