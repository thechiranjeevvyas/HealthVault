import { z } from "zod";

export enum MedicalEventType {
  CHECKUP = "CHECKUP",
  LAB_TEST = "LAB_TEST",
  VACCINATION = "VACCINATION",
  PRESCRIPTION = "PRESCRIPTION",
  SURGERY = "SURGERY",
  DENTAL = "DENTAL",
  EYE_CARE = "EYE_CARE",
  EMERGENCY_VISIT = "EMERGENCY_VISIT",
  OTHER = "OTHER",
}

export const eventSchema = z.object({
  memberId: z.string().uuid("Invalid member selection"),
  type: z.nativeEnum(MedicalEventType),
  title: z.string().min(2, "Title must be at least 2 characters").max(200, "Title too long"),
  date: z.string().refine((val) => {
    const date = new Date(val);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return !isNaN(date.getTime()) && date <= today;
  }, "Date cannot be in the future"),
  doctor: z.preprocess((val) => val === "" ? null : val, z.string().max(200).nullable().optional()),
  hospital: z.preprocess((val) => val === "" ? null : val, z.string().max(200).nullable().optional()),
  notes: z.preprocess((val) => val === "" ? null : val, z.string().max(5000).nullable().optional()),
});

export const updateEventSchema = eventSchema.partial().extend({
  id: z.string().min(1, "Event ID is required"),
});
