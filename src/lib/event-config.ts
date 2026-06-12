import { Stethoscope, FlaskConical, Syringe, Pill, Scissors, Smile, Eye, AlertCircle, FileText, LucideIcon } from "lucide-react";
import { MedicalEventType } from "@/lib/validations/event.schema";

export interface EventTypeConfig {
  label: string;
  color: string;
  textColor: string;
  borderColor: string;
  icon: LucideIcon;
  description: string;
}

export const EVENT_TYPE_CONFIG: Record<MedicalEventType, EventTypeConfig> = {
  [MedicalEventType.CHECKUP]: {
    label: "Checkup",
    color: "bg-blue-500/10",
    textColor: "text-blue-500",
    borderColor: "border-blue-500/20",
    icon: Stethoscope,
    description: "Routine health examination"
  },
  [MedicalEventType.LAB_TEST]: {
    label: "Lab Test",
    color: "bg-purple-500/10",
    textColor: "text-purple-500",
    borderColor: "border-purple-500/20",
    icon: FlaskConical,
    description: "Blood work, urine tests, etc."
  },
  [MedicalEventType.VACCINATION]: {
    label: "Vaccination",
    color: "bg-green-500/10",
    textColor: "text-green-500",
    borderColor: "border-green-500/20",
    icon: Syringe,
    description: "Vaccines and immunizations"
  },
  [MedicalEventType.PRESCRIPTION]: {
    label: "Prescription",
    color: "bg-orange-500/10",
    textColor: "text-orange-500",
    borderColor: "border-orange-500/20",
    icon: Pill,
    description: "Medications prescribed"
  },
  [MedicalEventType.SURGERY]: {
    label: "Surgery",
    color: "bg-red-500/10",
    textColor: "text-red-500",
    borderColor: "border-red-500/20",
    icon: Scissors,
    description: "Surgical procedures"
  },
  [MedicalEventType.DENTAL]: {
    label: "Dental",
    color: "bg-cyan-500/10",
    textColor: "text-cyan-500",
    borderColor: "border-cyan-500/20",
    icon: Smile,
    description: "Dental checkups and procedures"
  },
  [MedicalEventType.EYE_CARE]: {
    label: "Eye Care",
    color: "bg-indigo-500/10",
    textColor: "text-indigo-500",
    borderColor: "border-indigo-500/20",
    icon: Eye,
    description: "Vision tests and eye care"
  },
  [MedicalEventType.EMERGENCY_VISIT]: {
    label: "Emergency",
    color: "bg-rose-500/10",
    textColor: "text-rose-500",
    borderColor: "border-rose-500/20",
    icon: AlertCircle,
    description: "Emergency room visits"
  },
  [MedicalEventType.OTHER]: {
    label: "Other",
    color: "bg-gray-500/10",
    textColor: "text-gray-400",
    borderColor: "border-gray-500/20",
    icon: FileText,
    description: "Other medical events"
  }
};

export function getEventTypeConfig(type: MedicalEventType | string): EventTypeConfig {
  return EVENT_TYPE_CONFIG[type as MedicalEventType] || EVENT_TYPE_CONFIG[MedicalEventType.OTHER];
}

export const EVENT_TYPE_OPTIONS = Object.entries(EVENT_TYPE_CONFIG).map(([value, config]) => ({
  value: value as MedicalEventType,
  label: config.label,
  icon: config.icon,
  description: config.description
}));
