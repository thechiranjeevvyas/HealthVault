"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createMember, updateMember } from "@/actions/member.actions";
import { MemberDetail } from "@/types";
import { Gender, BloodGroup } from "@/lib/validations/member.schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

interface Props {
  member?: MemberDetail;
  onSuccess?: () => void;
}

const AVATAR_COLORS = [
  "#4f8ef7", "#34d399", "#fbbf24", "#f87171", "#a78bfa", 
  "#f472b6", "#38bdf8", "#fb923c", "#4ade80", "#e879f9"
];

export default function MemberForm({ member, onSuccess }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const [avatarColor, setAvatarColor] = useState(member?.avatarColor || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const formData = new FormData(e.currentTarget);
    if (avatarColor) {
      formData.append("avatarColor", avatarColor);
    }
    if (member) {
      formData.append("id", member.id);
    }

    startTransition(async () => {
      const action = member ? updateMember : createMember;
      const res = await action(formData);
      
      if (res.success) {
        if (onSuccess) onSuccess();
        else router.back();
      } else {
        setFormError(res.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-8">
      {formError && (
        <div className="bg-vault-danger/10 text-vault-danger p-3 rounded-md text-sm border border-vault-danger/20">
          {formError}
        </div>
      )}

      {/* Section 1: Basic Info */}
      <section className="space-y-4">
        <h3 className="text-sm font-medium text-vault-muted uppercase tracking-wide">Basic Info</h3>
        
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input id="name" name="name" defaultValue={member?.name} required disabled={isPending} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth *</Label>
            <Input id="dob" name="dob" type="date" defaultValue={member?.dob ? new Date(member.dob).toISOString().split('T')[0] : ""} required disabled={isPending} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender *</Label>
            <Select name="gender" defaultValue={member?.gender} required disabled={isPending}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Gender.MALE}>Male</SelectItem>
                <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                <SelectItem value={Gender.OTHER}>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bloodGroup">Blood Group</Label>
          <Select name="bloodGroup" defaultValue={member?.bloodGroup || "unknown"} disabled={isPending}>
            <SelectTrigger>
              <SelectValue placeholder="Unknown" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unknown">Unknown</SelectItem>
              {Object.values(BloodGroup).map(bg => (
                <SelectItem key={bg} value={bg}>{bg.replace("_", "")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 pt-2">
          <Label>Avatar Color</Label>
          <div className="flex flex-wrap gap-2">
            {AVATAR_COLORS.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => setAvatarColor(color)}
                className={`w-6 h-6 rounded-full transition-all ${avatarColor === color ? 'ring-2 ring-offset-2 ring-white ring-offset-vault-surface scale-110' : 'hover:scale-110 opacity-70 hover:opacity-100'}`}
                style={{ backgroundColor: color }}
              />
            ))}
            <button
              type="button"
              onClick={() => setAvatarColor("")}
              className={`text-xs px-2 py-1 rounded border border-vault-border text-vault-muted hover:text-white transition-colors ${!avatarColor ? 'bg-white/10 text-white border-white/20' : ''}`}
            >
              Auto
            </button>
          </div>
        </div>
      </section>

      <Separator className="bg-vault-border" />

      {/* Section 2: Medical Info */}
      <section className="space-y-4">
        <h3 className="text-sm font-medium text-vault-muted uppercase tracking-wide">Medical Info</h3>
        
        <div className="space-y-2">
          <Label htmlFor="allergies">Allergies</Label>
          <Textarea id="allergies" name="allergies" placeholder="e.g. Penicillin, Peanuts" defaultValue={member?.allergies || ""} disabled={isPending} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="chronicConditions">Chronic Conditions</Label>
          <Textarea id="chronicConditions" name="chronicConditions" placeholder="e.g. Diabetes Type 2, Hypertension" defaultValue={member?.chronicConditions || ""} disabled={isPending} />
        </div>
      </section>

      <Separator className="bg-vault-border" />

      {/* Section 3: Emergency & Insurance */}
      <section className="space-y-4">
        <h3 className="text-sm font-medium text-vault-muted uppercase tracking-wide">Emergency & Insurance</h3>
        
        <div className="space-y-2">
          <Label htmlFor="emergencyContact">Emergency Contact</Label>
          <Textarea id="emergencyContact" name="emergencyContact" placeholder="Name, relation, phone number" defaultValue={member?.emergencyContact || ""} disabled={isPending} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="insuranceDetails">Insurance Details</Label>
          <Textarea id="insuranceDetails" name="insuranceDetails" placeholder="Provider, policy number, coverage" defaultValue={member?.insuranceDetails || ""} disabled={isPending} />
        </div>
      </section>

      <Separator className="bg-vault-border" />

      {/* Section 4: Notes */}
      <section className="space-y-4">
        <h3 className="text-sm font-medium text-vault-muted uppercase tracking-wide">Additional Notes</h3>
        <div className="space-y-2">
          <Textarea id="notes" name="notes" rows={4} placeholder="Any additional health notes..." defaultValue={member?.notes || ""} disabled={isPending} />
        </div>
      </section>

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
          {member ? "Save Member" : "Add Member"}
        </Button>
      </div>
    </form>
  );
}
