import type { 
  VaultSettings, 
  FamilyMember, 
  MedicalEvent, 
  Document, 
  Tag, 
  EventTag, 
  DocumentTag 
} from "@prisma/client";

export enum MedicalEventType {
  CHECKUP = "CHECKUP",
  LAB_TEST = "LAB_TEST",
  VACCINATION = "VACCINATION",
  PRESCRIPTION = "PRESCRIPTION",
  SURGERY = "SURGERY",
  DENTAL = "DENTAL",
  EYE_CARE = "EYE_CARE",
  EMERGENCY_VISIT = "EMERGENCY_VISIT",
  OTHER = "OTHER"
}

export enum FileType {
  PDF = "PDF",
  JPG = "JPG",
  PNG = "PNG",
  WEBP = "WEBP",
  DOCX = "DOCX"
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER"
}

export enum BloodGroup {
  A_POS = "A_POS",
  A_NEG = "A_NEG",
  B_POS = "B_POS",
  B_NEG = "B_NEG",
  AB_POS = "AB_POS",
  AB_NEG = "AB_NEG",
  O_POS = "O_POS",
  O_NEG = "O_NEG"
}

export type {
  VaultSettings,
  FamilyMember,
  MedicalEvent,
  Document,
  Tag,
  EventTag,
  DocumentTag
};
