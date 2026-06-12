import { getEventsGroupedByYear } from "@/services/event.service";
import { getAllMembers } from "@/services/member.service";
import TimelineClient from "@/components/events/TimelineClient";

export default async function TimelinePage() {
  const [eventsByYear, members] = await Promise.all([
    getEventsGroupedByYear(),
    getAllMembers()
  ]);

  return <TimelineClient eventsByYear={eventsByYear} members={members} />;
}
