import { z } from "zod";
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum BloodGroup {
  A_POS = "A_POS",
  A_NEG = "A_NEG",
  B_POS = "B_POS",
  B_NEG = "B_NEG",
  AB_POS = "AB_POS",
  AB_NEG = "AB_NEG",
  O_POS = "O_POS",
  O_NEG = "O_NEG",
}

export const memberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name cannot exceed 100 characters"),
  dob: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime()) && date < new Date();
  }, "Date of birth must be a valid past date"),
  gender: z.nativeEnum(Gender),
  bloodGroup: z.preprocess((val) => val === "" || val === "unknown" ? null : val, z.nativeEnum(BloodGroup).nullable().optional()),
  allergies: z.preprocess((val) => val === "" ? null : val, z.string().max(1000).nullable().optional()),
  chronicConditions: z.preprocess((val) => val === "" ? null : val, z.string().max(1000).nullable().optional()),
  emergencyContact: z.preprocess((val) => val === "" ? null : val, z.string().max(500).nullable().optional()),
  insuranceDetails: z.preprocess((val) => val === "" ? null : val, z.string().max(1000).nullable().optional()),
  notes: z.preprocess((val) => val === "" ? null : val, z.string().max(2000).nullable().optional()),
  avatarColor: z.preprocess((val) => val === "" ? null : val, z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Must be a valid hex color").nullable().optional()),
});

export const updateMemberSchema = memberSchema.partial().extend({
  id: z.string().min(1, "Member ID is required"),
});
