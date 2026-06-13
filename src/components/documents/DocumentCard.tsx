"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Eye, Trash2 } from "lucide-react";
import { DocumentWithEvent } from "@/types";
import { deleteDocumentAction } from "@/actions/document.actions";
import FileTypeIcon from "./FileTypeIcon";
import EventTypeBadge from "@/components/events/EventTypeBadge";
import DocumentPreviewModal from "./DocumentPreviewModal";
import { getFileSizeFormatted } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
  document: DocumentWithEvent;
  showEvent?: boolean;
  onDelete?: (id: string) => void;
}

export default function DocumentCard({ document, showEvent = true, onDelete }: Props) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteDocumentAction(document.id);
    setIsDeleting(false);
    setDeleteOpen(false);
    if (onDelete) onDelete(document.id);
  };

  return (
    <>
      <div className="bg-vault-surface border border-vault-border rounded-xl p-4 hover:border-vault-primary transition-colors relative group overflow-hidden flex flex-col h-full">
        <div className="flex items-start gap-4 mb-4 pr-12">
          <FileTypeIcon fileType={document.fileType} size={40} />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-vault-text truncate mb-1" title={document.fileName}>
              {document.fileName}
            </h4>
            <div className="text-xs text-vault-muted flex items-center gap-1.5">
              <span>{getFileSizeFormatted(document.fileSize)}</span>
              <span>&middot;</span>
              <span>{format(new Date(document.uploadedAt), "MMM d, yyyy")}</span>
            </div>
          </div>
        </div>

        {showEvent && document.event && (
          <div className="mt-auto pt-4 border-t border-vault-border/50 flex items-center gap-2">
            <EventTypeBadge type={document.event.type} size="sm" />
            <span className="text-xs text-vault-muted truncate flex-1" title={document.event.title}>
              {document.event.title}
            </span>
          </div>
        )}

        <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.preventDefault(); setPreviewOpen(true); }}
            className="p-1.5 text-vault-muted hover:text-vault-text hover:bg-white/10 rounded-md transition-colors"
            title="Preview Document"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); setDeleteOpen(true); }}
            className="p-1.5 text-vault-muted hover:text-vault-danger hover:bg-vault-danger/10 rounded-md transition-colors"
            title="Delete Document"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <DocumentPreviewModal 
        documentId={document.id} 
        open={previewOpen} 
        onOpenChange={setPreviewOpen} 
        fileName={document.fileName}
        fileType={document.fileType}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this document?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &apos;{document.fileName}&apos; from the filesystem and database. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => { e.preventDefault(); handleDelete(); }} 
              disabled={isDeleting}
              className="bg-vault-danger text-white hover:bg-vault-danger/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
