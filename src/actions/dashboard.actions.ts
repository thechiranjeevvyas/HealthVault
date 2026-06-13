"use server";

import { db } from "@/lib/db";

export async function getDashboardStats() {
  const totalMembers = await db.familyMember.count();
  const totalEvents = await db.medicalEvent.count();
  const [totalDocuments, sizeResult] = await Promise.all([
    db.document.count(),
    db.document.aggregate({ _sum: { fileSize: true } })
  ]);
  
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  const thisMonthEvents = await db.medicalEvent.count({
    where: {
      date: {
        gte: startOfMonth
      }
    }
  });

  return {
    totalMembers,
    totalEvents,
    totalDocuments,
    totalStorageUsed: sizeResult._sum.fileSize || 0,
    thisMonthEvents
  };
}

export async function getRecentActivity(limit = 5) {
  const events = await db.medicalEvent.findMany({
    take: limit,
    orderBy: {
      date: 'desc'
    },
    include: {
      member: true
    }
  });

  return events.map(event => ({
    id: event.id,
    memberName: event.member.name,
    memberColor: event.member.avatarColor,
    eventType: event.type,
    title: event.title,
    date: event.date
  }));
}

export async function getFamilyOverview() {
  const members = await db.familyMember.findMany({
    include: {
      _count: {
        select: { events: true }
      },
      events: {
        orderBy: { date: 'desc' },
        take: 1,
        select: { date: true }
      }
    }
  });

  return members.map(member => ({
    id: member.id,
    name: member.name,
    dob: member.dob,
    avatarColor: member.avatarColor,
    eventCount: member._count.events,
    lastEventDate: member.events[0]?.date || null
  }));
}
