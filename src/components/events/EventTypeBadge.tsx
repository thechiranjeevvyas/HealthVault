import { MedicalEventType } from "@/lib/validations/event.schema";
import { getEventTypeConfig } from "@/lib/event-config";

interface Props {
  type: MedicalEventType | string;
  size?: "sm" | "md";
}

export default function EventTypeBadge({ type, size = "md" }: Props) {
  const config = getEventTypeConfig(type);
  const Icon = config.icon;
  
  const sizeClasses = size === "sm" 
    ? "px-2 py-0.5 text-[10px] gap-1" 
    : "px-2.5 py-1 text-xs gap-1.5";
    
  const iconSize = size === "sm" ? 12 : 14;

  return (
    <div className={`inline-flex items-center font-semibold rounded-full border ${config.color} ${config.textColor} ${config.borderColor} ${sizeClasses}`}>
      <Icon size={iconSize} />
      <span>{config.label}</span>
    </div>
  );
}
