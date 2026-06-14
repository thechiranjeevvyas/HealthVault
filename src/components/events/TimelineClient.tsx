"use client";

import { useState, useMemo } from "react";
import { Activity } from "lucide-react";
import { MemberWithStats, EventsByYear, EventWithMember, EventDetail } from "@/types";
import { EVENT_TYPE_OPTIONS, getEventTypeConfig } from "@/lib/event-config";
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
  const yearsCount = Object.keys(filteredEventsByYear).length;
  const typesCount = new Set(Object.values(filteredEventsByYear).flat().map(e => e.type)).size;

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12 scroll-smooth">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-vault-text">Timeline</h1>
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
        <div className="space-y-4">
          <div className="bg-vault-surface border border-vault-border rounded-xl p-4 space-y-4">
            {/* Member Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button
                onClick={() => setMemberFilter("ALL")}
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors border ${
                  memberFilter === "ALL" 
                    ? "bg-vault-primary text-white border-vault-primary" 
                    : "bg-vault-bg text-vault-muted border-vault-border hover:text-vault-text"
                }`}
              >
                All Members
              </button>
              {members.map(m => (
                <button
                  key={m.id}
                  onClick={() => setMemberFilter(m.id)}
                  className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors border ${
                    memberFilter === m.id 
                      ? "bg-vault-primary text-white border-vault-primary" 
                      : "bg-vault-bg text-vault-muted border-vault-border hover:text-vault-text"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full border border-black/10 dark:border-white/10" style={{ backgroundColor: m.avatarColor || "#4f8ef7" }} />
                  {m.name}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-vault-border/50">
              <div className="w-full sm:w-48">
                <Select value={typeFilter} onValueChange={(v) => v && setTypeFilter(v)}>
                  <SelectTrigger className="bg-vault-bg border-vault-border text-vault-text">
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
                <Button variant="ghost" className="text-vault-muted hover:text-vault-text text-sm" onClick={() => {
                  setMemberFilter("ALL");
                  setTypeFilter("ALL");
                }}>
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
          
          {/* STATS BAR */}
          <div className="text-xs text-vault-muted px-1 flex items-center justify-between">
            <div>
              Showing {filteredCount} event{filteredCount !== 1 && 's'} &middot; across {yearsCount} year{yearsCount !== 1 && 's'} &middot; {typesCount} event type{typesCount !== 1 && 's'}
            </div>
          </div>
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
        <div className="relative pt-6">
          <div className="absolute left-[11px] top-0 bottom-0 w-[2px] bg-vault-border rounded-full"></div>

          <div className="space-y-10">
            {Object.entries(filteredEventsByYear)
              .sort(([a], [b]) => Number(b) - Number(a))
              .map(([year, events]) => (
              <div key={year} className="relative">
                {/* Year Separator */}
                <div className="sticky top-[64px] z-10 flex items-center py-4 mb-4 bg-vault-bg/95 backdrop-blur-sm -mx-4 px-4 sm:-mx-0 sm:px-0">
                  <div className="flex items-center w-full">
                    <div className="flex-1 h-px bg-vault-border/50"></div>
                    <div className="px-4 text-sm font-bold text-vault-muted flex items-center gap-2">
                      {year}
                      <span className="text-[10px] uppercase tracking-wider font-semibold opacity-70 bg-vault-surface border border-vault-border/50 px-2 py-0.5 rounded-full">
                        {events.length} event{events.length !== 1 && "s"}
                      </span>
                    </div>
                    <div className="flex-1 h-px bg-vault-border/50"></div>
                  </div>
                </div>

                <div className="space-y-6">
                  {events.map(event => {
                    const typeConfig = getEventTypeConfig(event.type);
                    const dotColorClass = typeConfig.color.replace("/10", "");

                    return (
                      <div key={event.id} className="relative flex items-start group">
                        {/* Dot */}
                        <div className="absolute left-[6px] top-6 w-3 h-3 rounded-full border-2 border-vault-bg z-10 flex-shrink-0" 
                             style={{ backgroundColor: 'currentColor' }} 
                        >
                           <div className={`w-full h-full rounded-full ${dotColorClass}`}></div>
                        </div>

                        {/* Card */}
                        <div className="ml-[32px] w-full">
                          <EventCard 
                            event={event}
                            timelineMode={true}
                            onEdit={() => openEdit(event)}
                            onDelete={() => {}} // timeline uses dialog internally inside card, or relies on callback.
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
