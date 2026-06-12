"use client";

import { useState, useMemo } from "react";
import { Activity } from "lucide-react";
import { MemberDetail, EventWithMember, EventsByYear, EventDetail, MemberWithStats } from "@/types";
import EventCard from "@/components/events/EventCard";
import EmptyState from "@/components/shared/EmptyState";
import EventForm from "@/components/events/EventForm";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface Props {
  member: MemberDetail;
}

export default function MemberEventsClient({ member }: Props) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventWithMember | undefined>();

  const eventsByYear = useMemo(() => {
    const grouped: EventsByYear = {};
    for (const event of member.events) {
      const eventWithMember = { 
        ...event, 
        member: { id: member.id, name: member.name, avatarColor: member.avatarColor } 
      } as EventWithMember;
      
      const year = new Date(event.date).getFullYear();
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(eventWithMember);
    }
    return grouped;
  }, [member]);

  const totalEvents = member.events.length;

  const openEdit = (event: EventWithMember) => {
    setEditingEvent(event);
    setIsSheetOpen(true);
  };

  const handleSheetChange = (open: boolean) => {
    setIsSheetOpen(open);
    if (!open) setEditingEvent(undefined);
  };

  return (
    <div className="bg-vault-surface border border-vault-border rounded-xl overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-vault-border gap-4">
        <div>
          <h2 className="text-lg font-semibold text-vault-text">Medical Events</h2>
          <p className="text-sm text-vault-muted">{totalEvents} event{totalEvents !== 1 && "s"} recorded</p>
        </div>
        <Button className="bg-vault-primary text-white hover:bg-vault-primary/90" onClick={() => setIsSheetOpen(true)}>
          + Log Event
        </Button>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={handleSheetChange}>
        <SheetContent className="bg-vault-surface border-l-vault-border w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-vault-text">{editingEvent ? "Edit Event" : "Log Medical Event"}</SheetTitle>
          </SheetHeader>
          <EventForm 
            event={editingEvent as unknown as EventDetail}
            defaultMemberId={member.id}
            members={[member as unknown as MemberWithStats]}
            onSuccess={() => handleSheetChange(false)} 
          />
        </SheetContent>
      </Sheet>

      <div className="p-6">
        {totalEvents === 0 ? (
          <EmptyState
            icon={Activity}
            title="No medical events yet"
            description={`Start logging health events for ${member.name}.`}
            action={{ label: "Log First Event", onClick: () => setIsSheetOpen(true) }}
          />
        ) : (
          <div className="space-y-8">
            {Object.entries(eventsByYear)
              .sort(([a], [b]) => Number(b) - Number(a))
              .map(([year, events]) => (
              <div key={year} className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-sm font-semibold text-vault-muted bg-vault-surface border border-vault-border px-3 py-1 rounded-full flex items-center gap-2">
                    {year}
                  </div>
                  <div className="flex-1 h-px bg-vault-border"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {events.map(event => (
                    <EventCard 
                      key={event.id}
                      event={event}
                      showMember={false}
                      onEdit={() => openEdit(event)}
                      onDelete={() => {}}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
