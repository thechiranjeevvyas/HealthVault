import Link from "next/link";
import { notFound } from "next/navigation";
import { format, formatDistanceToNow } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { getMember } from "@/actions/member.actions";
import MemberAvatar from "@/components/shared/MemberAvatar";
import MemberDetailActions from "@/components/members/MemberDetailActions";

function InfoRow({ label, value }: { label: string, value?: string | null }) {
  return (
    <div className="py-2">
      <div className="text-xs uppercase text-vault-muted font-medium tracking-wide mb-1">{label}</div>
      <div className={value ? "text-vault-text" : "text-vault-muted"}>{value || "Not specified"}</div>
    </div>
  );
}

export default async function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getMember(id);
  
  if (!result.success || !result.data) {
    notFound();
  }

  const member = result.data;
  let age = "Age unknown";
  if (member.dob) {
    age = `${Math.floor((new Date().getTime() - new Date(member.dob).getTime()) / 3.15576e+10)} years`;
  }
  const bgFormat = member.bloodGroup?.replace("_", "") || "Unknown";

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <Link href="/members" className="flex items-center gap-2 text-sm text-vault-muted hover:text-vault-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Members
        </Link>
        <MemberDetailActions member={member} />
      </div>

      <div className="bg-vault-surface border border-vault-border rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <MemberAvatar name={member.name} color={member.avatarColor} size="xl" />
        <div>
          <h1 className="text-2xl font-bold text-vault-text">{member.name}</h1>
          <div className="flex items-center gap-3 text-vault-muted mt-2 text-sm">
            <span>{age}</span>
            <span>&middot;</span>
            <span className="capitalize">{member.gender.toLowerCase()}</span>
            <span>&middot;</span>
            <span>Blood: {bgFormat}</span>
          </div>
          <div className="text-xs text-vault-muted mt-2">
            Member since {format(new Date(member.createdAt), "MMMM yyyy")}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-vault-surface border border-vault-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-vault-text border-b border-vault-border pb-2">Health Info</h2>
          <div className="space-y-4">
            <InfoRow label="Allergies" value={member.allergies} />
            <InfoRow label="Chronic Conditions" value={member.chronicConditions} />
          </div>
        </div>

        <div className="bg-vault-surface border border-vault-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-vault-text border-b border-vault-border pb-2">Contact & Insurance</h2>
          <div className="space-y-4">
            <InfoRow label="Emergency Contact" value={member.emergencyContact} />
            <InfoRow label="Insurance Details" value={member.insuranceDetails} />
            <InfoRow label="Notes" value={member.notes} />
          </div>
        </div>
      </div>

      <div className="bg-vault-surface border border-vault-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-vault-border">
          <h2 className="text-lg font-semibold text-vault-text">Recent Events</h2>
          <Link href={`/timeline?member=${member.id}`} className="text-sm text-vault-primary hover:underline">
            View All
          </Link>
        </div>
        <div className="p-0">
          {member.events.length === 0 ? (
            <div className="p-6 text-center text-vault-muted text-sm">
              No medical events recorded
            </div>
          ) : (
            <div className="divide-y divide-vault-border">
              {member.events.slice(0, 5).map(event => (
                <div key={event.id} className="p-4 px-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-vault-border text-vault-muted">
                        {event.type.replace("_", " ")}
                      </span>
                      <span className="font-medium text-vault-text">{event.title}</span>
                    </div>
                    <div className="text-sm text-vault-muted">
                      {event.doctor || "No doctor specified"}
                    </div>
                  </div>
                  <div className="text-xs text-vault-muted whitespace-nowrap text-right">
                    {format(new Date(event.date), "MMM d, yyyy")}
                    <div className="mt-1">
                      {formatDistanceToNow(new Date(event.date), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
