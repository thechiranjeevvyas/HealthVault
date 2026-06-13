import { Prisma } from "@prisma/client";

export type MemberWithStats = Prisma.FamilyMemberGetPayload<{
  include: {
    _count: {
      select: { events: true; documents: true };
    };
    events: {
      orderBy: { date: 'desc' };
      take: 1;
      select: { date: true };
    };
  };
}>;

export type MemberDetail = Prisma.FamilyMemberGetPayload<{
  include: {
    events: {
      orderBy: { date: 'desc' };
    };
    documents: true;
    _count: {
      select: { events: true; documents: true };
    };
  };
}>;

export type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

export type EventWithMember = Prisma.MedicalEventGetPayload<{
  include: {
    member: {
      select: { id: true; name: true; avatarColor: true }
    }
  }
}>;

export type EventDetail = Prisma.MedicalEventGetPayload<{
  include: {
    member: true;
    documents: true;
  }
}>;

export type CreateEventInput = Prisma.MedicalEventUncheckedCreateInput;
export type UpdateEventInput = Prisma.MedicalEventUpdateInput;

export interface EventFilters {
  memberId?: string;
  type?: string;
  fromDate?: Date;
  toDate?: Date;
  search?: string;
}

export type EventsByYear = Record<number, EventWithMember[]>;

export type DocumentWithEvent = Prisma.DocumentGetPayload<{
  include: {
    event: { select: { id: true; title: true; type: true; date: true } }
    member: true;
  }
}>;

export type DocumentWithMember = Prisma.DocumentGetPayload<{
  include: { member: true }
}>;

export interface UploadDocumentInput {
  file: File;
  memberId: string;
  eventId?: string;
}


