import { db } from "@/lib/db";
import { MemberWithStats, MemberDetail } from "@/types";
import { deleteMemberFiles } from "@/lib/storage";
import { Prisma, FamilyMember } from "@prisma/client";

const AVATAR_COLORS = [
  "#4f8ef7", "#34d399", "#fbbf24", "#f87171", "#a78bfa", 
  "#f472b6", "#38bdf8", "#fb923c", "#4ade80", "#e879f9"
];

export async function getAllMembers(): Promise<MemberWithStats[]> {
  return db.familyMember.findMany({
    orderBy: { createdAt: 'asc' },
    include: {
      _count: {
        select: { events: true, documents: true }
      },
      events: {
        orderBy: { date: 'desc' },
        take: 1,
        select: { date: true }
      }
    }
  });
}

export async function getMemberById(id: string): Promise<MemberDetail | null> {
  return db.familyMember.findUnique({
    where: { id },
    include: {
      events: {
        orderBy: { date: 'desc' }
      },
      documents: true,
      _count: {
        select: { events: true, documents: true }
      }
    }
  });
}

export async function createMember(data: Prisma.FamilyMemberUncheckedCreateInput): Promise<FamilyMember> {
  let avatarColor = data.avatarColor;
  
  if (!avatarColor) {
    const count = await getMemberCount();
    avatarColor = AVATAR_COLORS[count % AVATAR_COLORS.length];
  }

  return db.familyMember.create({
    data: {
      ...data,
      avatarColor,
    }
  });
}

export async function updateMember(id: string, data: Prisma.FamilyMemberUpdateInput): Promise<FamilyMember> {
  const existing = await db.familyMember.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Member not found");
  }

  return db.familyMember.update({
    where: { id },
    data
  });
}

export async function deleteMember(id: string): Promise<void> {
  await db.familyMember.delete({ where: { id } });
  await deleteMemberFiles(id);
}

export async function getMemberCount(): Promise<number> {
  return db.familyMember.count();
}
