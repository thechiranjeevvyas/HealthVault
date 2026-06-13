"use client";

import { useState } from "react";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DocumentWithEvent } from "@/types";
import DocumentCard from "@/components/documents/DocumentCard";
import UploadZone from "@/components/documents/UploadZone";
import EmptyState from "@/components/shared/EmptyState";
import { useRouter } from "next/navigation";

interface Props {
  memberId: string;
  initialDocuments: DocumentWithEvent[];
}

export default function MemberDocumentsClient({ memberId, initialDocuments }: Props) {
  const router = useRouter();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [documents, setDocuments] = useState(initialDocuments);

  const handleDelete = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const handleUploadComplete = () => {
    setIsUploadOpen(false);
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-vault-text">Documents</h2>
        <Button onClick={() => setIsUploadOpen(true)} className="bg-vault-primary text-white hover:bg-vault-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {documents.length === 0 ? (
        <div className="bg-vault-surface border border-vault-border rounded-xl">
          <EmptyState
            icon={FileText}
            title="No documents attached"
            description="Upload medical reports, prescriptions, or ID cards for this member."
            action={{
              label: "Upload Document",
              onClick: () => setIsUploadOpen(true)
            }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {documents.map(doc => (
            <DocumentCard key={doc.id} document={doc} showEvent={true} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <Sheet open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <SheetContent className="bg-vault-surface border-l-vault-border w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-vault-text">Upload Document</SheetTitle>
          </SheetHeader>
          <UploadZone 
            memberId={memberId} 
            onUploadComplete={handleUploadComplete} 
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
