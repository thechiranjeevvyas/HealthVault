"use client";

import { useState, useCallback } from "react";
import { UploadCloud, CheckCircle2, XCircle, Paperclip } from "lucide-react";
import { Document } from "@prisma/client";
import FileTypeIcon from "./FileTypeIcon";

interface Props {
  memberId: string;
  eventId?: string;
  onUploadComplete?: (doc: Document) => void;
  compact?: boolean;
}

interface UploadProgress {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "success" | "error";
  error?: string;
}

export default function UploadZone({ memberId, eventId, onUploadComplete, compact = false }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState<UploadProgress[]>([]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const newUploads: UploadProgress[] = [];
    
    Array.from(files).forEach((file) => {
      const id = Math.random().toString(36).substring(7);
      
      let error: string | undefined;
      if (file.size > 50 * 1024 * 1024) {
        error = "File exceeds 50MB";
      } else if (!["application/pdf", "image/jpeg", "image/png", "image/webp", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)) {
        error = "Invalid file type";
      }

      const uploadItem: UploadProgress = {
        id,
        file,
        progress: error ? 0 : 0,
        status: error ? "error" : "uploading",
        error
      };
      
      newUploads.push(uploadItem);

      if (!error) {
        uploadFile(uploadItem);
      }
    });

    setUploads(prev => [...prev, ...newUploads]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberId, eventId, onUploadComplete]);

  const uploadFile = (item: UploadProgress) => {
    const formData = new FormData();
    formData.append("file", item.file);
    formData.append("memberId", memberId);
    if (eventId) formData.append("eventId", eventId);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload", true);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const progress = Math.round((e.loaded / e.total) * 100);
        setUploads(prev => prev.map(u => u.id === item.id ? { ...u, progress } : u));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          const res = JSON.parse(xhr.responseText);
          if (res.success) {
            setUploads(prev => prev.map(u => u.id === item.id ? { ...u, status: "success", progress: 100 } : u));
            if (onUploadComplete) onUploadComplete(res.document);
            
            setTimeout(() => {
              setUploads(prev => prev.filter(u => u.id !== item.id));
            }, 3000);
          } else {
            setUploads(prev => prev.map(u => u.id === item.id ? { ...u, status: "error", error: res.error } : u));
          }
        } catch {
          setUploads(prev => prev.map(u => u.id === item.id ? { ...u, status: "error", error: "Invalid response" } : u));
        }
      } else {
        setUploads(prev => prev.map(u => u.id === item.id ? { ...u, status: "error", error: "Upload failed" } : u));
      }
    };

    xhr.onerror = () => {
      setUploads(prev => prev.map(u => u.id === item.id ? { ...u, status: "error", error: "Network error" } : u));
    };

    xhr.send(formData);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    e.target.value = ''; // reset
  };

  return (
    <div className="space-y-4">
      {compact ? (
        <label className={`relative flex items-center justify-between p-4 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${isDragging ? 'border-vault-primary bg-vault-primary/5' : 'border-vault-border bg-vault-surface hover:bg-vault-bg'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex items-center gap-3">
            <Paperclip className="w-5 h-5 text-vault-muted" />
            <span className="text-sm font-medium text-vault-text">Attach Documents</span>
          </div>
          <span className="text-sm text-vault-primary font-medium hover:underline">Browse Files</span>
          <input type="file" multiple className="hidden" onChange={handleChange} accept=".pdf,.jpg,.jpeg,.png,.webp,.docx" />
        </label>
      ) : (
        <label className={`relative flex flex-col items-center justify-center p-10 rounded-xl border-2 border-dashed cursor-pointer transition-colors text-center ${isDragging ? 'border-vault-primary bg-vault-primary/5' : 'border-vault-border bg-vault-surface hover:bg-vault-bg'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${isDragging ? 'bg-vault-primary/20 text-vault-primary' : 'bg-vault-bg text-vault-muted'}`}>
            <UploadCloud className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-vault-text mb-1">
            {isDragging ? "Drop to upload" : "Drop files here or click to browse"}
          </h3>
          <p className="text-sm text-vault-muted">
            PDF, JPG, PNG, WEBP, DOCX &middot; Max 50MB
          </p>
          <input type="file" multiple className="hidden" onChange={handleChange} accept=".pdf,.jpg,.jpeg,.png,.webp,.docx" />
        </label>
      )}

      {uploads.length > 0 && (
        <div className="space-y-2">
          {uploads.map(upload => {
            let fileType = "OTHER";
            if (upload.file.type === "application/pdf") fileType = "PDF";
            else if (upload.file.type.startsWith("image/")) fileType = upload.file.type.split('/')[1].toUpperCase();
            else if (upload.file.type.includes("wordprocessing")) fileType = "DOCX";

            return (
              <div key={upload.id} className="bg-vault-surface border border-vault-border rounded-lg p-3 flex items-center gap-3">
                <FileTypeIcon fileType={fileType} size={36} />
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium text-vault-text truncate pr-4">{upload.file.name}</p>
                    {upload.status === "uploading" && <span className="text-xs text-vault-muted">{upload.progress}%</span>}
                    {upload.status === "success" && <CheckCircle2 className="w-4 h-4 text-vault-success" />}
                    {upload.status === "error" && <XCircle className="w-4 h-4 text-vault-danger" />}
                  </div>
                  
                  {upload.status === "uploading" && (
                    <div className="w-full h-1.5 bg-vault-bg rounded-full overflow-hidden">
                      <div className="h-full bg-vault-primary transition-all duration-300" style={{ width: `${upload.progress}%` }} />
                    </div>
                  )}
                  {upload.status === "error" && (
                    <p className="text-xs text-vault-danger">{upload.error}</p>
                  )}
                  {upload.status === "success" && (
                    <p className="text-xs text-vault-success">Uploaded successfully</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
