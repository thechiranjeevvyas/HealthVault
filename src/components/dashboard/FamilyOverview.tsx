import Link from "next/link";
import { Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import EmptyState from "@/components/shared/EmptyState";

interface FamilyOverviewItem {
  id: string;
  name: string;
  dob: Date;
  avatarColor: string | null;
  eventCount: number;
  lastEventDate: Date | null;
}

export default function FamilyOverview({ members }: { members: FamilyOverviewItem[] }) {
  return (
    <div className="bg-vault-surface border border-vault-border rounded-xl flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-vault-border">
        <h2 className="text-lg font-semibold text-vault-text">Family Members</h2>
        <Link href="/members" className="text-sm text-vault-primary hover:underline">
          Manage
        </Link>
      </div>

      <div className="flex-1 p-5 min-h-[300px]">
        {members.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No family members"
            description="Add your family members to start managing their health records securely."
            action={{ label: "Add First Member", href: "/members?action=new" }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {members.map((member) => {
              const initials = member.name.substring(0, 2).toUpperCase();
              const age = Math.floor((new Date().getTime() - member.dob.getTime()) / 3.15576e+10);
              
              return (
                <div key={member.id} className="border border-vault-border rounded-lg p-4 flex flex-col items-center text-center bg-vault-bg/50 hover:bg-vault-bg transition-colors">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3 shadow-md"
                    style={{ backgroundColor: member.avatarColor || "#4f8ef7" }}
                  >
                    {initials}
                  </div>
                  
                  <h3 className="text-vault-text font-medium truncate w-full">{member.name}</h3>
                  <p className="text-vault-muted text-xs mb-3">{age} years</p>
                  
                  <div className="mt-auto w-full flex flex-col gap-1.5">
                    <div className="bg-vault-surface rounded px-2 py-1 text-xs text-vault-text border border-vault-border">
                      {member.eventCount} record{member.eventCount !== 1 && "s"}
                    </div>
                    <div className="text-[10px] text-vault-muted">
                      {member.lastEventDate 
                        ? `Last: ${formatDistanceToNow(member.lastEventDate, { addSuffix: true })}`
                        : "No records yet"
                      }
                    </div>
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
