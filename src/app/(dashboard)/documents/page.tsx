import { getDocuments } from "@/actions/document.actions";
import { getDocumentStats } from "@/services/document.service";
import { getAllMembers } from "@/services/member.service";
import DocumentsClient from "@/components/documents/DocumentsClient";

export default async function DocumentsPage() {
  const [docsRes, stats, members] = await Promise.all([
    getDocuments(),
    getDocumentStats(),
    getAllMembers()
  ]);

  return (
    <DocumentsClient 
      documents={docsRes.success && docsRes.data ? docsRes.data : []} 
      stats={stats} 
      members={members} 
    />
  );
}
