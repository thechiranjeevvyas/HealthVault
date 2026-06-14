import { db } from "@/lib/db";
import { EventFilters, EventWithMember, EventDetail, EventsByYear } from "@/types";
import { Prisma, MedicalEvent } from "@prisma/client";
import { indexEvent, removeFromIndex } from "./search-index.service";

export async function getAllEvents(filters?: EventFilters): Promise<EventWithMember[]> {
  const where: Prisma.MedicalEventWhereInput = {};

  if (filters?.memberId) where.memberId = filters.memberId;
  if (filters?.type) where.type = filters.type;
  if (filters?.fromDate || filters?.toDate) {
    where.date = {};
    if (filters.fromDate) where.date.gte = filters.fromDate;
    if (filters.toDate) where.date.lte = filters.toDate;
  }
  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search } },
      { doctor: { contains: filters.search } },
      { hospital: { contains: filters.search } },
      { notes: { contains: filters.search } }
    ];
  }

  return db.medicalEvent.findMany({
    where,
    orderBy: { date: 'desc' },
    include: {
      member: {
        select: { id: true, name: true, avatarColor: true }
      }
    }
  });
}

export async function getEventById(id: string): Promise<EventDetail | null> {
  return db.medicalEvent.findUnique({
    where: { id },
    include: {
      member: true,
      documents: {
        select: {
          id: true,
          fileName: true,
          fileType: true,
          fileSize: true,
          uploadedAt: true,
          eventId: true,
          memberId: true,
          filePath: true,
          ocrText: true
        }
      }
    }
  }) as unknown as Promise<EventDetail | null>;
}

export async function createEvent(data: Prisma.MedicalEventUncheckedCreateInput): Promise<MedicalEvent> {
  const event = await db.medicalEvent.create({ data });
  await indexEvent(event).catch(console.error);
  return event;
}

export async function updateEvent(id: string, data: Prisma.MedicalEventUpdateInput): Promise<MedicalEvent> {
  const existing = await db.medicalEvent.findUnique({ where: { id } });
  if (!existing) throw new Error("Event not found");

  const updated = await db.medicalEvent.update({
    where: { id },
    data
  });
  await indexEvent(updated).catch(console.error);
  return updated;
}

export async function deleteEvent(id: string): Promise<void> {
  await db.medicalEvent.delete({ where: { id } });
  await removeFromIndex('event', id).catch(console.error);
}

export async function getEventsByMember(memberId: string): Promise<EventWithMember[]> {
  return getAllEvents({ memberId });
}

export async function getEventsGroupedByYear(memberId?: string): Promise<EventsByYear> {
  const events = await getAllEvents({ memberId });
  const grouped: EventsByYear = {};

  for (const event of events) {
    const year = event.date.getFullYear();
    if (!grouped[year]) {
      grouped[year] = [];
    }
    grouped[year].push(event);
  }

  return grouped;
}

export async function getRecentEvents(limit: number = 5): Promise<EventWithMember[]> {
  return db.medicalEvent.findMany({
    take: limit,
    orderBy: { date: 'desc' },
    include: {
      member: {
        select: { id: true, name: true, avatarColor: true }
      }
    }
  });
}
