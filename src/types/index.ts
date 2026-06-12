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

