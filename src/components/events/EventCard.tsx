"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Pencil, Trash2, MapPin, UserRound } from "lucide-react";
import { EventWithMember } from "@/types";
import { getEventTypeConfig } from "@/lib/event-config";
import EventTypeBadge from "./EventTypeBadge";
import MemberAvatar from "@/components/shared/MemberAvatar";
import DeleteEventDialog from "./DeleteEventDialog";

interface Props {
  event: EventWithMember;
  showMember?: boolean;
  onEdit?: (event: EventWithMember) => void;
  onDelete?: (event: EventWithMember) => void;
  timelineMode?: boolean;
}

export default function EventCard({ event, showMember = true, timelineMode = false, onEdit, onDelete }: Props) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const config = getEventTypeConfig(event.type);

  const borderColorClass = config.borderColor.replace("/20", "");
  
  const cardClasses = `bg-vault-surface border border-vault-border rounded-xl hover:shadow-md transition-shadow relative group overflow-hidden ${timelineMode ? 'p-4' : 'p-5'} ${timelineMode ? '' : `border-l-4 ${borderColorClass}`}`;

  return (
    <>
      <div className={cardClasses}>
        
        <div className="flex justify-between items-start mb-3">
          <EventTypeBadge type={event.type} size="sm" />
          <div className={`text-xs font-medium ${timelineMode ? "text-vault-text" : "text-vault-muted"}`}>
            {format(new Date(event.date), "MMM d, yyyy")}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-vault-text mb-2">{event.title}</h3>

        {showMember && event.member && (
          <div className="flex items-center gap-2 mb-3">
            <MemberAvatar name={event.member.name} color={event.member.avatarColor} size="sm" />
            <span className="text-sm font-medium text-vault-text">{event.member.name}</span>
          </div>
        )}

        {(event.hospital || event.doctor) && (
          <div className="flex flex-wrap gap-4 text-xs text-vault-muted mb-3">
            {event.hospital && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{event.hospital}</span>
              </div>
            )}
            {event.doctor && (
              <div className="flex items-center gap-1.5">
                <UserRound className="w-3.5 h-3.5" />
                <span>{event.doctor}</span>
              </div>
            )}
          </div>
        )}

        {event.notes && (
          <p className="text-sm text-vault-muted line-clamp-2 mt-2">
            {event.notes}
          </p>
        )}

        <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          {onEdit && (
            <button 
              onClick={(e) => { e.preventDefault(); onEdit(event); }}
              className="p-2 text-vault-muted hover:text-vault-text hover:bg-white/10 rounded-md transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button 
              onClick={(e) => { e.preventDefault(); setDeleteOpen(true); }}
              className="p-2 text-vault-muted hover:text-vault-danger hover:bg-vault-danger/10 rounded-md transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {onDelete && (
        <DeleteEventDialog 
          event={{ id: event.id, title: event.title }} 
          open={deleteOpen} 
          onOpenChange={setDeleteOpen} 
          onDeleted={() => onDelete(event)}
        />
      )}
    </>
  );
}
