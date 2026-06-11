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
