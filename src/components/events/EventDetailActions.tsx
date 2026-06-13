"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import EventForm from "./EventForm";
import DeleteEventDialog from "./DeleteEventDialog";
import { EventDetail, MemberWithStats } from "@/types";

interface Props {
  event: EventDetail;
  members: MemberWithStats[];
}

export default function EventDetailActions({ event, members }: Props) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="border-vault-border" onClick={() => setIsEditOpen(true)}>
          <Pencil className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button variant="outline" size="sm" className="border-vault-danger text-vault-danger hover:bg-vault-danger hover:text-white" onClick={() => setIsDeleteOpen(true)}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>

      <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
        <SheetContent className="bg-vault-surface border-l-vault-border w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-vault-text">Edit Event</SheetTitle>
          </SheetHeader>
          <EventForm 
            event={event}
            members={members}
            onSuccess={() => setIsEditOpen(false)} 
          />
        </SheetContent>
      </Sheet>

      <DeleteEventDialog 
        event={{ id: event.id, title: event.title }} 
        open={isDeleteOpen} 
        onOpenChange={setIsDeleteOpen} 
        onDeleted={() => router.push("/timeline")}
      />
    </>
  );
}
