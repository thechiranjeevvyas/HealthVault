import MembersClient from "@/components/members/MembersClient";
import { getMembers } from "@/actions/member.actions";

export default async function MembersPage() {
  const result = await getMembers();
  
  if (!result.success) {
    return <div className="text-vault-danger p-6">Error loading members: {result.error}</div>;
  }

  return <MembersClient members={result.data} />;
}
