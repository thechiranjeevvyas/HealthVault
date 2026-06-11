"use server";

import { revalidatePath } from "next/cache";
import { memberSchema, updateMemberSchema } from "@/lib/validations/member.schema";
import * as memberService from "@/services/member.service";
import { ActionResult, MemberWithStats, MemberDetail } from "@/types";
import { FamilyMember, Prisma } from "@prisma/client";

export async function getMembers(): Promise<ActionResult<MemberWithStats[]>> {
  try {
    const members = await memberService.getAllMembers();
    return { success: true, data: members };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch members" };
  }
}

export async function getMember(id: string): Promise<ActionResult<MemberDetail>> {
  try {
    const member = await memberService.getMemberById(id);
    if (!member) return { success: false, error: "Member not found" };
    return { success: true, data: member };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch member" };
  }
}

export async function createMember(formData: FormData): Promise<ActionResult<FamilyMember>> {
  try {
    const data = Object.fromEntries(formData.entries());
    const result = memberSchema.safeParse(data);
    
    if (!result.success) {
      return { success: false, error: result.error.issues[0].message };
    }

    const memberData = {
      ...result.data,
      dob: new Date(result.data.dob).toISOString(),
    };

    const newMember = await memberService.createMember(memberData as Prisma.FamilyMemberUncheckedCreateInput);
    
    revalidatePath("/members");
    revalidatePath("/");
    
    return { success: true, data: newMember };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to create member" };
  }
}

export async function updateMember(formData: FormData): Promise<ActionResult<FamilyMember>> {
  try {
    const data = Object.fromEntries(formData.entries());
    const result = updateMemberSchema.safeParse(data);
    
    if (!result.success) {
      return { success: false, error: result.error.issues[0].message };
    }

    const { id, ...updateData } = result.data;
    
    const formattedData = {
      ...updateData,
      dob: updateData.dob ? new Date(updateData.dob).toISOString() : undefined,
    };

    const updated = await memberService.updateMember(id!, formattedData as Prisma.FamilyMemberUpdateInput);
    
    revalidatePath("/members");
    revalidatePath(`/members/${id}`);
    
    return { success: true, data: updated };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to update member" };
  }
}

export async function deleteMemberAction(id: string): Promise<ActionResult<void>> {
  try {
    await memberService.deleteMember(id);
    revalidatePath("/members");
    revalidatePath("/");
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete member" };
  }
}
