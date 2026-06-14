import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { FamilyMember, MedicalEvent, Document } from "@prisma/client";

export interface SearchParams {
  query: string;
  memberId?: string;
  entityTypes?: string[];
  limit?: number;
}

export interface SearchIndexRow {
  entity_type: string;
  entity_id: string;
  member_id: string;
  snippet: string;
  rank: number;
}

export type MemberSearchResult = FamilyMember & { snippet: string };
export type EventSearchResult = MedicalEvent & { snippet: string; member: FamilyMember };
export type DocumentSearchResult = Document & { snippet: string; member: FamilyMember; event?: MedicalEvent | null };

export interface SearchResults {
  members: MemberSearchResult[];
  events: EventSearchResult[];
  documents: DocumentSearchResult[];
  total: number;
  query: string;
  timeTaken: number;
}

export async function search(params: SearchParams): Promise<SearchResults> {
  const startTime = Date.now();
  const limit = params.limit || 20;
  
  const sanitized = params.query.trim().replace(/['"*^()]/g, '');
  if (!sanitized) {
    return { members: [], events: [], documents: [], total: 0, query: params.query, timeTaken: 0 };
  }
  
  const matchQuery = sanitized + '*';
  
  const memberFilter = params.memberId ? Prisma.sql`AND member_id = ${params.memberId}` : Prisma.empty;
  const typeFilter = params.entityTypes && params.entityTypes.length > 0 
    ? Prisma.sql`AND entity_type IN (${Prisma.join(params.entityTypes)})` 
    : Prisma.empty;

  const rows = await db.$queryRaw<SearchIndexRow[]>`
    SELECT entity_type, entity_id, member_id,
           snippet(SearchIndex, 3, '<mark>', '</mark>', '...', 8) as snippet,
           rank
    FROM SearchIndex
    WHERE SearchIndex MATCH ${matchQuery}
    ${memberFilter}
    ${typeFilter}
    ORDER BY rank
    LIMIT ${limit}
  `;

  const memberIds = rows.filter(r => r.entity_type === 'member').map(r => r.entity_id);
  const eventIds = rows.filter(r => r.entity_type === 'event').map(r => r.entity_id);
  const documentIds = rows.filter(r => r.entity_type === 'document').map(r => r.entity_id);

  const [membersData, eventsData, documentsData] = await Promise.all([
    memberIds.length > 0 ? db.familyMember.findMany({ where: { id: { in: memberIds } } }) : Promise.resolve([]),
    eventIds.length > 0 ? db.medicalEvent.findMany({ where: { id: { in: eventIds } }, include: { member: true } }) : Promise.resolve([]),
    documentIds.length > 0 ? db.document.findMany({ where: { id: { in: documentIds } }, include: { member: true, event: true } }) : Promise.resolve([])
  ]);

  const members: MemberSearchResult[] = [];
  const events: EventSearchResult[] = [];
  const documents: DocumentSearchResult[] = [];

  for (const row of rows) {
    if (row.entity_type === 'member') {
      const m = membersData.find(x => x.id === row.entity_id);
      if (m) members.push({ ...m, snippet: row.snippet });
    } else if (row.entity_type === 'event') {
      const e = eventsData.find(x => x.id === row.entity_id);
      if (e) events.push({ ...e, snippet: row.snippet } as EventSearchResult);
    } else if (row.entity_type === 'document') {
      const d = documentsData.find(x => x.id === row.entity_id);
      if (d) documents.push({ ...d, snippet: row.snippet } as DocumentSearchResult);
    }
  }

  return {
    members,
    events,
    documents,
    total: rows.length,
    query: params.query,
    timeTaken: Date.now() - startTime
  };
}
