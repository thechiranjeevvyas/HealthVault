"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MemberDetail } from "@/types";
import MemberForm from "@/components/members/MemberForm";
import DeleteMemberDialog from "@/components/members/DeleteMemberDialog";

interface Props {
  member: MemberDetail;
}

export default function MemberDetailActions({ member }: Props) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <div className="flex gap-2">
        <Button variant="outline" className="border-vault-border hover:bg-vault-surface text-vault-text" onClick={() => setIsEditOpen(true)}>
          <Pencil className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button variant="outline" className="border-vault-danger text-vault-danger hover:bg-vault-danger/10" onClick={() => setIsDeleteOpen(true)}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>

      <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
        <SheetContent className="bg-vault-surface border-l-vault-border w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-vault-text">Edit Member</SheetTitle>
          </SheetHeader>
          <MemberForm member={member} onSuccess={() => setIsEditOpen(false)} />
        </SheetContent>
      </Sheet>

      <DeleteMemberDialog 
        member={{ id: member.id, name: member.name }} 
        open={isDeleteOpen} 
        onOpenChange={setIsDeleteOpen} 
      />
    </>
  );
}
