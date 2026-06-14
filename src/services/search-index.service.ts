import { db } from "@/lib/db";
import { FamilyMember, MedicalEvent, Document } from "@prisma/client";

export async function indexMember(member: FamilyMember): Promise<void> {
  const title = member.name;
  const body = [
    member.allergies,
    member.chronicConditions,
    member.notes,
    member.emergencyContact,
    member.insuranceDetails
  ].filter(Boolean).join(' ');
  const tags = member.bloodGroup ?? '';

  await db.$executeRaw`DELETE FROM SearchIndex WHERE entity_type = 'member' AND entity_id = ${member.id}`;
  
  await db.$executeRaw`
    INSERT INTO SearchIndex(entity_type, entity_id, member_id, title, body, tags)
    VALUES ('member', ${member.id}, ${member.id}, ${title}, ${body}, ${tags})
  `;
}

export async function indexEvent(event: MedicalEvent): Promise<void> {
  const title = event.title;
  const body = [event.doctor, event.hospital, event.notes, event.type].filter(Boolean).join(' ');
  const tags = event.type.toLowerCase().replace(/_/g, ' ');

  await db.$executeRaw`DELETE FROM SearchIndex WHERE entity_type = 'event' AND entity_id = ${event.id}`;
  
  await db.$executeRaw`
    INSERT INTO SearchIndex(entity_type, entity_id, member_id, title, body, tags)
    VALUES ('event', ${event.id}, ${event.memberId}, ${title}, ${body}, ${tags})
  `;
}

export async function indexDocument(document: Document): Promise<void> {
  const title = document.fileName;
  const body = document.ocrText ?? '';
  const tags = document.fileType.toLowerCase();

  await db.$executeRaw`DELETE FROM SearchIndex WHERE entity_type = 'document' AND entity_id = ${document.id}`;
  
  await db.$executeRaw`
    INSERT INTO SearchIndex(entity_type, entity_id, member_id, title, body, tags)
    VALUES ('document', ${document.id}, ${document.memberId}, ${title}, ${body}, ${tags})
  `;
}

export async function removeFromIndex(entityType: string, entityId: string): Promise<void> {
  await db.$executeRaw`DELETE FROM SearchIndex WHERE entity_type = ${entityType} AND entity_id = ${entityId}`;
}

export async function reindexAll(): Promise<void> {
  console.log("Starting full re-index of SearchIndex...");
  
  // Clear the table first
  await db.$executeRaw`DELETE FROM SearchIndex`;
  
  const members = await db.familyMember.findMany();
  for (const m of members) await indexMember(m);
  
  const events = await db.medicalEvent.findMany();
  for (const e of events) await indexEvent(e);
  
  const documents = await db.document.findMany();
  for (const d of documents) await indexDocument(d);
  
  console.log(`Re-index complete: ${members.length} members, ${events.length} events, ${documents.length} documents.`);
}
