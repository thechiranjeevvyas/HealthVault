import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, UserRound, MapPin } from "lucide-react";
import { getEvent } from "@/actions/event.actions";
import { getAllMembers } from "@/services/member.service";
import EventTypeBadge from "@/components/events/EventTypeBadge";
import MemberAvatar from "@/components/shared/MemberAvatar";
import DocumentCard from "@/components/documents/DocumentCard";
import UploadZone from "@/components/documents/UploadZone";
import EventDetailActions from "@/components/events/EventDetailActions";
import { EventDetail, DocumentWithEvent } from "@/types";

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await getEvent(id);
  
  if (!res.success || !res.data) {
    notFound();
  }
  
  const event = res.data;
  const members = await getAllMembers();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <Link href="/timeline" className="inline-flex items-center text-sm font-medium text-vault-muted hover:text-vault-text transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Timeline
        </Link>
        <EventDetailActions event={event as unknown as EventDetail} members={members} />
      </div>

      <div className="bg-vault-surface border border-vault-border rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <EventTypeBadge type={event.type} />
              <span className="text-sm font-medium text-vault-muted">
                {format(new Date(event.date), "MMMM d, yyyy")}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-vault-text">{event.title}</h1>
          </div>
          
          <Link href={`/members/${event.memberId}`} className="flex items-center gap-2 px-3 py-1.5 bg-vault-bg rounded-lg hover:bg-vault-border transition-colors w-fit">
            <MemberAvatar name={event.member.name} color={event.member.avatarColor} size="sm" />
            <span className="text-sm font-medium text-vault-text">{event.member.name}</span>
          </Link>
        </div>

        {(event.doctor || event.hospital) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-vault-border/50 mb-6 bg-vault-bg/30 rounded-lg px-4">
            {event.doctor && (
              <div className="flex items-center gap-2">
                <UserRound className="w-4 h-4 text-vault-muted" />
                <span className="text-sm text-vault-text"><span className="text-vault-muted">Doctor:</span> {event.doctor}</span>
              </div>
            )}
            {event.hospital && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-vault-muted" />
                <span className="text-sm text-vault-text"><span className="text-vault-muted">Location:</span> {event.hospital}</span>
              </div>
            )}
          </div>
        )}

        {event.notes && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-vault-muted uppercase tracking-wider mb-2">Notes</h3>
            <div className="text-vault-text whitespace-pre-wrap text-sm leading-relaxed bg-vault-bg/50 p-4 rounded-lg border border-vault-border/50">
              {event.notes}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-vault-muted uppercase tracking-wider">Attached Documents</h3>
          </div>
          
          <div className="mb-6">
            <UploadZone memberId={event.memberId} eventId={event.id} />
          </div>

          {event.documents && event.documents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {event.documents.map(doc => (
                <DocumentCard key={doc.id} document={doc as unknown as DocumentWithEvent} showEvent={false} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed border-vault-border rounded-xl bg-vault-bg/30">
              <p className="text-sm text-vault-muted">No documents attached yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
