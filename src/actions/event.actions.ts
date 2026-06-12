"use server";

import { revalidatePath } from "next/cache";
import { eventSchema, updateEventSchema } from "@/lib/validations/event.schema";
import * as eventService from "@/services/event.service";
import { ActionResult, EventWithMember, EventDetail, EventFilters } from "@/types";
import { MedicalEvent, Prisma } from "@prisma/client";

export async function getEvents(filters?: EventFilters): Promise<ActionResult<EventWithMember[]>> {
  try {
    const events = await eventService.getAllEvents(filters);
    return { success: true, data: events };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch events" };
  }
}

export async function getEvent(id: string): Promise<ActionResult<EventDetail>> {
  try {
    const event = await eventService.getEventById(id);
    if (!event) return { success: false, error: "Event not found" };
    return { success: true, data: event };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch event" };
  }
}

export async function createEventAction(formData: FormData): Promise<ActionResult<MedicalEvent>> {
  try {
    const data = Object.fromEntries(formData.entries());
    const result = eventSchema.safeParse(data);
    
    if (!result.success) {
      return { success: false, error: result.error.issues[0].message };
    }

    const eventData = {
      ...result.data,
      date: new Date(result.data.date).toISOString(),
    };

    const newEvent = await eventService.createEvent(eventData as Prisma.MedicalEventUncheckedCreateInput);
    
    revalidatePath("/timeline");
    revalidatePath("/");
    revalidatePath(`/members/${result.data.memberId}`);
    
    return { success: true, data: newEvent };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to create event" };
  }
}

export async function updateEventAction(formData: FormData): Promise<ActionResult<MedicalEvent>> {
  try {
    const data = Object.fromEntries(formData.entries());
    const result = updateEventSchema.safeParse(data);
    
    if (!result.success) {
      return { success: false, error: result.error.issues[0].message };
    }

    const { id, ...updateData } = result.data;
    
    const formattedData = {
      ...updateData,
      date: updateData.date ? new Date(updateData.date).toISOString() : undefined,
    };

    const updated = await eventService.updateEvent(id!, formattedData as Prisma.MedicalEventUpdateInput);
    
    revalidatePath("/timeline");
    revalidatePath("/");
    revalidatePath(`/members/${updated.memberId}`);
    
    return { success: true, data: updated };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to update event" };
  }
}

export async function deleteEventAction(id: string): Promise<ActionResult<void>> {
  try {
    const event = await eventService.getEventById(id);
    if (event) {
      await eventService.deleteEvent(id);
      revalidatePath("/timeline");
      revalidatePath("/");
      revalidatePath(`/members/${event.memberId}`);
    }
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete event" };
  }
}
