"use client";

import { useState, useMemo } from "react";
import { Activity } from "lucide-react";
import { MemberWithStats, EventsByYear, EventWithMember, EventDetail } from "@/types";
import { EVENT_TYPE_OPTIONS } from "@/lib/event-config";
import EventCard from "./EventCard";
import EmptyState from "@/components/shared/EmptyState";
import EventForm from "./EventForm";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface Props {
  eventsByYear: EventsByYear;
  members: MemberWithStats[];
}

export default function TimelineClient({ eventsByYear, members }: Props) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventDetail | undefined>();
  
  const [memberFilter, setMemberFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  const totalEvents = useMemo(() => {
    return Object.values(eventsByYear).flat().length;
  }, [eventsByYear]);

  // Flatten and filter
  const filteredEventsByYear = useMemo(() => {
    if (memberFilter === "ALL" && typeFilter === "ALL") return eventsByYear;
    
    const filtered: EventsByYear = {};
    for (const [year, events] of Object.entries(eventsByYear)) {
      const filteredEvents = events.filter(e => {
        const matchMember = memberFilter === "ALL" || e.memberId === memberFilter;
        const matchType = typeFilter === "ALL" || e.type === typeFilter;
        return matchMember && matchType;
      });
      
      if (filteredEvents.length > 0) {
        filtered[Number(year)] = filteredEvents;
      }
    }
    return filtered;
  }, [eventsByYear, memberFilter, typeFilter]);

  const filteredCount = useMemo(() => {
    return Object.values(filteredEventsByYear).flat().length;
  }, [filteredEventsByYear]);

  const openEdit = (event: EventWithMember) => {
    setEditingEvent(event as unknown as EventDetail);
    setIsSheetOpen(true);
  };

  const handleSheetChange = (open: boolean) => {
    setIsSheetOpen(open);
    if (!open) setEditingEvent(undefined);
  };

  const hasActiveFilters = memberFilter !== "ALL" || typeFilter !== "ALL";

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-vault-text">Timeline</h1>
          <p className="text-vault-muted text-sm">
            {hasActiveFilters ? `Showing ${filteredCount} of ${totalEvents} events` : `${totalEvents} events logged`}
          </p>
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
            event={editingEvent}
            members={members}
            onSuccess={() => handleSheetChange(false)} 
          />
        </SheetContent>
      </Sheet>

      {/* FILTER BAR */}
      {totalEvents > 0 && (
        <div className="bg-vault-surface border border-vault-border rounded-xl p-3 flex flex-wrap items-center gap-3">
          <div className="w-full sm:w-48">
            <Select value={memberFilter} onValueChange={(v) => v && setMemberFilter(v)}>
              <SelectTrigger className="bg-vault-bg border-vault-border">
                <SelectValue placeholder="All Members" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Members</SelectItem>
                {members.map(m => (
                  <SelectItem key={m.id} value={m.id}>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: m.avatarColor || "#4f8ef7" }} />
                      {m.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-48">
            <Select value={typeFilter} onValueChange={(v) => v && setTypeFilter(v)}>
              <SelectTrigger className="bg-vault-bg border-vault-border">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                {EVENT_TYPE_OPTIONS.map(t => (
                  <SelectItem key={t.value} value={t.value}>
                    <div className="flex items-center gap-2">
                      <t.icon className="w-3.5 h-3.5" />
                      {t.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <Button variant="ghost" className="text-vault-muted hover:text-vault-text" onClick={() => {
              setMemberFilter("ALL");
              setTypeFilter("ALL");
            }}>
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* TIMELINE CONTENT */}
      {totalEvents === 0 ? (
        <div className="bg-vault-surface border border-vault-border rounded-xl">
          <EmptyState
            icon={Activity}
            title="No medical events yet"
            description="Start logging health events for your family to build a comprehensive medical timeline."
            action={{ label: "Log First Event", onClick: () => setIsSheetOpen(true) }}
          />
        </div>
      ) : filteredCount === 0 ? (
        <div className="text-center py-12 text-vault-muted bg-vault-surface border border-vault-border rounded-xl">
          No events match your filters
          <div className="mt-4">
            <Button variant="outline" className="border-vault-border" onClick={() => {
              setMemberFilter("ALL");
              setTypeFilter("ALL");
            }}>
              Clear Filters
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(filteredEventsByYear)
            .sort(([a], [b]) => Number(b) - Number(a))
            .map(([year, events]) => (
            <div key={year} className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-sm font-semibold text-vault-muted bg-vault-surface border border-vault-border px-3 py-1 rounded-full flex items-center gap-2">
                  {year}
                  <span className="text-xs font-normal opacity-70 bg-vault-bg px-1.5 py-0.5 rounded-full">
                    {events.length} event{events.length !== 1 && "s"}
                  </span>
                </div>
                <div className="flex-1 h-px bg-vault-border"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map(event => (
                  <EventCard 
                    key={event.id}
                    event={event}
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
  );
}
