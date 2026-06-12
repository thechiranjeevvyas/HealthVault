import Link from "next/link";
import { Activity } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import EmptyState from "@/components/shared/EmptyState";
import EventTypeBadge from "@/components/events/EventTypeBadge";
import MemberAvatar from "@/components/shared/MemberAvatar";

interface RecentActivityItem {
  id: string;
  memberName: string;
  memberColor: string | null;
  eventType: string; // Prisma enum comes as string
  title: string;
  date: Date;
}

export default function RecentActivity({ events }: { events: RecentActivityItem[] }) {
  return (
    <div className="bg-vault-surface border border-vault-border rounded-xl flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-vault-border">
        <h2 className="text-lg font-semibold text-vault-text">Recent Activity</h2>
        <Link href="/timeline" className="text-sm text-vault-primary hover:underline">
          View All
        </Link>
      </div>

      <div className="flex-1 p-5 flex flex-col min-h-[300px]">
        {events.length === 0 ? (
          <EmptyState
            icon={Activity}
            title="No recent activity"
            description="Log medical events, checkups, and prescriptions to see them here."
          />
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
                <MemberAvatar name={event.memberName} color={event.memberColor} size="md" />
                
                <div className="flex-1 min-w-0">
                  <p className="text-vault-text font-medium truncate">{event.title}</p>
                  <p className="text-vault-muted text-sm truncate">{event.memberName}</p>
                </div>
                
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <EventTypeBadge type={event.eventType} size="sm" />
                  <span className="text-xs text-vault-muted">
                    {formatDistanceToNow(new Date(event.date), { addSuffix: true })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
