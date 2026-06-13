import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { getMember } from "@/actions/member.actions";
import MemberAvatar from "@/components/shared/MemberAvatar";
import MemberDetailActions from "@/components/members/MemberDetailActions";
import MemberEventsClient from "@/components/members/MemberEventsClient";
import MemberDocumentsClient from "@/components/members/MemberDocumentsClient";
import { getDocumentsByMember } from "@/services/document.service";

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
  const [result, documents] = await Promise.all([
    getMember(id),
    getDocumentsByMember(id)
  ]);
  
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

      <MemberEventsClient member={member} />
      
      <div className="pt-6 border-t border-vault-border mt-8">
        <MemberDocumentsClient memberId={member.id} initialDocuments={documents} />
      </div>
    </div>
  );
}
