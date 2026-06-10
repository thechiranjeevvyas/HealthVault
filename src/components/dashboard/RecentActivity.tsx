import Link from "next/link";
import { Activity } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import EmptyState from "@/components/shared/EmptyState";

interface RecentActivityItem {
  id: string;
  memberName: string;
  memberColor: string | null;
  eventType: string; // Prisma enum comes as string
  title: string;
  date: Date;
}

const TYPE_COLORS: Record<string, string> = {
  CHECKUP: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  LAB_TEST: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  VACCINATION: "bg-green-500/10 text-green-500 border-green-500/20",
  PRESCRIPTION: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  SURGERY: "bg-red-500/10 text-red-500 border-red-500/20",
  DENTAL: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  EYE_CARE: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  EMERGENCY_VISIT: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  OTHER: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

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
            {events.map((event) => {
              const initials = event.memberName.substring(0, 2).toUpperCase();
              const badgeStyle = TYPE_COLORS[event.eventType] || TYPE_COLORS.OTHER;
              
              return (
                <div key={event.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
                  <div 
                    className="w-10 h-10 rounded-full flex shrink-0 items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: event.memberColor || "#4f8ef7" }}
                  >
                    {initials}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-vault-text font-medium truncate">{event.title}</p>
                    <p className="text-vault-muted text-sm truncate">{event.memberName}</p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${badgeStyle}`}>
                      {event.eventType.replace("_", " ")}
                    </span>
                    <span className="text-xs text-vault-muted">
                      {formatDistanceToNow(event.date, { addSuffix: true })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
