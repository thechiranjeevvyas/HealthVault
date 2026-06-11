"use client";

import { useState } from "react";
import { Search, Users } from "lucide-react";
import { MemberWithStats, MemberDetail } from "@/types";
import MemberCard from "./MemberCard";
import EmptyState from "@/components/shared/EmptyState";
import MemberForm from "./MemberForm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface Props {
  members: MemberWithStats[];
}

export default function MembersClient({ members }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<MemberDetail | undefined>();

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openEdit = (member: MemberWithStats) => {
    setEditingMember(member as unknown as MemberDetail);
    setIsSheetOpen(true);
  };

  const handleSheetChange = (open: boolean) => {
    setIsSheetOpen(open);
    if (!open) setEditingMember(undefined);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-vault-text">Family Members</h1>
          <p className="text-vault-muted text-sm">{members.length} family member{members.length !== 1 && 's'}</p>
        </div>

        <Button className="bg-vault-primary text-white hover:bg-vault-primary/90" onClick={() => setIsSheetOpen(true)}>
          + Add Member
        </Button>

        <Sheet open={isSheetOpen} onOpenChange={handleSheetChange}>
          <SheetContent className="bg-vault-surface border-l-vault-border w-full sm:max-w-md overflow-y-auto">
            <SheetHeader className="mb-6">
              <SheetTitle className="text-vault-text">{editingMember ? "Edit Member" : "Add Family Member"}</SheetTitle>
            </SheetHeader>
            <MemberForm 
              member={editingMember} 
              onSuccess={() => handleSheetChange(false)} 
            />
          </SheetContent>
        </Sheet>
      </div>

      {members.length > 0 && (
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-vault-muted" />
          <Input 
            placeholder="Search members..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-vault-surface/50 border-vault-border text-vault-text"
          />
        </div>
      )}

      {members.length === 0 ? (
        <div className="bg-vault-surface border border-vault-border rounded-xl">
          <EmptyState
            icon={Users}
            title="No family members"
            description="Add your first family member to start managing their health records securely."
          />
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center py-12 text-vault-muted bg-vault-surface border border-vault-border rounded-xl">
          No members found matching &quot;{searchQuery}&quot;
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <MemberCard 
              key={member.id} 
              member={member} 
              onEdit={() => openEdit(member)} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
