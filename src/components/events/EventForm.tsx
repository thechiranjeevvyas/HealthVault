"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createEventAction, updateEventAction } from "@/actions/event.actions";
import { EventDetail, MemberWithStats } from "@/types";
import { MedicalEventType } from "@/lib/validations/event.schema";
import { EVENT_TYPE_OPTIONS } from "@/lib/event-config";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Paperclip } from "lucide-react";

interface Props {
  event?: EventDetail;
  defaultMemberId?: string;
  members: MemberWithStats[];
  onSuccess?: () => void;
}

export default function EventForm({ event, defaultMemberId, members, onSuccess }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const [selectedType, setSelectedType] = useState<MedicalEventType | "">(
    (event?.type as MedicalEventType) || ""
  );

  const [selectedMember, setSelectedMember] = useState<string>(
    event?.memberId || defaultMemberId || ""
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedType) {
      setFormError("Please select an event type");
      return;
    }
    
    if (!selectedMember) {
      setFormError("Please select a family member");
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.append("type", selectedType);
    formData.append("memberId", selectedMember);
    
    if (event) {
      formData.append("id", event.id);
    }

    startTransition(async () => {
      const action = event ? updateEventAction : createEventAction;
      const res = await action(formData);
      
      if (res.success) {
        if (onSuccess) onSuccess();
        else router.refresh();
      } else {
        setFormError(res.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-8">
      {formError && (
        <div className="bg-vault-danger/10 text-vault-danger p-3 rounded-md text-sm border border-vault-danger/20">
          {formError}
        </div>
      )}

      {/* EVENT TYPE SELECTOR */}
      <div className="space-y-3">
        <Label>Event Type *</Label>
        <div className="grid grid-cols-3 gap-2">
          {EVENT_TYPE_OPTIONS.map((opt) => {
            const isSelected = selectedType === opt.value;
            const Icon = opt.icon;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedType(opt.value)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center h-24 ${
                  isSelected 
                    ? "bg-vault-primary/10 border-vault-primary" 
                    : "bg-vault-surface border-vault-border hover:border-vault-primary/50"
                }`}
              >
                <Icon className={`w-6 h-6 mb-2 ${isSelected ? "text-vault-primary" : "text-vault-muted"}`} />
                <span className={`text-xs font-medium ${isSelected ? "text-vault-primary" : "text-vault-text"}`}>
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Family Member *</Label>
          <Select value={selectedMember} onValueChange={(v) => v && setSelectedMember(v)} disabled={isPending}>
            <SelectTrigger>
              <SelectValue placeholder="Select member" />
            </SelectTrigger>
            <SelectContent>
              {members.map(m => (
                <SelectItem key={m.id} value={m.id}>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: m.avatarColor || "#4f8ef7" }} />
                    {m.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Input 
            id="date" 
            name="date" 
            type="date" 
            defaultValue={event?.date ? new Date(event.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]} 
            required 
            disabled={isPending} 
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" name="title" defaultValue={event?.title} placeholder="e.g. Annual Checkup" required disabled={isPending} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="doctor">Doctor</Label>
          <Input id="doctor" name="doctor" defaultValue={event?.doctor || ""} placeholder="e.g. Dr. Smith" disabled={isPending} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hospital">Hospital / Clinic</Label>
          <Input id="hospital" name="hospital" defaultValue={event?.hospital || ""} placeholder="e.g. City General" disabled={isPending} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={4} placeholder="Any details, symptoms, or recommendations..." defaultValue={event?.notes || ""} disabled={isPending} />
      </div>

      <div className="border border-dashed border-vault-border rounded-xl p-4 flex flex-col items-center justify-center text-center bg-vault-surface/50">
        <div className="w-10 h-10 rounded-full bg-vault-bg flex items-center justify-center mb-2">
          <Paperclip className="w-5 h-5 text-vault-muted" />
        </div>
        <p className="text-sm font-medium text-vault-text">Document upload coming soon</p>
        <p className="text-xs text-vault-muted mt-1 max-w-xs">
          You can attach lab reports, prescriptions, and scans after saving this event.
        </p>
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={() => { if (onSuccess) onSuccess(); else router.back(); }}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} className="bg-vault-primary text-white hover:bg-vault-primary/90">
          {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {event ? "Save Event" : "Log Event"}
        </Button>
      </div>
    </form>
  );
}
