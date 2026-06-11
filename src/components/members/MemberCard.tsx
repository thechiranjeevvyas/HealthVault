"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Pencil, Trash2, Activity, FileText } from "lucide-react";
import { MemberWithStats } from "@/types";
import MemberAvatar from "@/components/shared/MemberAvatar";
import DeleteMemberDialog from "./DeleteMemberDialog";

interface Props {
  member: MemberWithStats;
  onEdit: () => void;
}

export default function MemberCard({ member, onEdit }: Props) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  let ageLabel = "Age unknown";
  if (member.dob) {
    const age = Math.floor((new Date().getTime() - new Date(member.dob).getTime()) / 3.15576e+10);
    ageLabel = `${age} years old`;
  }

  const bgFormat = member.bloodGroup?.replace("_", "") || "Unknown";

  return (
    <>
      <div className="bg-vault-surface border border-vault-border rounded-xl p-5 hover:border-vault-primary transition-colors flex flex-col h-full relative group">
        <Link href={`/members/${member.id}`} className="flex-1 cursor-pointer">
          <div className="flex items-center gap-4 mb-4">
            <MemberAvatar name={member.name} color={member.avatarColor} size="xl" />
            <div>
              <h3 className="text-lg font-semibold text-vault-text truncate">{member.name}</h3>
              <div className="flex items-center gap-2 text-sm text-vault-muted mt-1">
                <span>{ageLabel}</span>
                <span>&middot;</span>
                <span className="bg-vault-border px-2 py-0.5 rounded text-xs text-vault-text">
                  {bgFormat}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 py-3 border-y border-vault-border/50 mb-3">
            <div className="flex items-center gap-2 text-sm text-vault-muted">
              <Activity className="w-4 h-4 text-vault-primary" />
              <span>{member._count.events} events</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-vault-muted">
              <FileText className="w-4 h-4 text-vault-primary" />
              <span>{member._count.documents} docs</span>
            </div>
          </div>

          <div className="text-xs text-vault-muted">
            Last activity: {member.events && member.events.length > 0 
              ? formatDistanceToNow(new Date(member.events[0].date), { addSuffix: true })
              : "No records yet"}
          </div>
        </Link>

        {/* Absolute positioned actions */}
        <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.preventDefault(); onEdit(); }}
            className="p-2 text-vault-muted hover:text-vault-text hover:bg-white/10 rounded-md transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); setDeleteOpen(true); }}
            className="p-2 text-vault-muted hover:text-vault-danger hover:bg-vault-danger/10 rounded-md transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <DeleteMemberDialog 
        member={{ id: member.id, name: member.name }} 
        open={deleteOpen} 
        onOpenChange={setDeleteOpen} 
      />
    </>
  );
}
