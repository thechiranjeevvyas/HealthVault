"use client";

import { useState } from "react";
import { Download, X, ZoomIn, ZoomOut } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FileTypeIcon from "./FileTypeIcon";
import { Copy, Check, Loader2 } from "lucide-react";

interface Props {
  documentId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileName?: string;
  fileType?: string;
  ocrText?: string | null;
}

export default function DocumentPreviewModal({ documentId, open, onOpenChange, fileName = "Document", fileType = "OTHER", ocrText = null }: Props) {
  const [zoomed, setZoomed] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fileUrl = documentId ? `/api/documents/${documentId}` : "";

  const handleCopy = () => {
    if (ocrText) {
      navigator.clipboard.writeText(ocrText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = async () => {
    if (!documentId) return;
    setIsDownloading(true);
    
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (e) {
      console.error("Download failed", e);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] max-h-[1000px] flex flex-col p-0 gap-0 bg-vault-surface border-vault-border">
        {/* Visually hidden title to satisfy aria-describedby for accessibility */}
        <DialogTitle className="sr-only">Preview Document</DialogTitle>
        <div className="flex items-center justify-between p-4 border-b border-vault-border bg-vault-bg/50">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <FileTypeIcon fileType={fileType} size={32} />
            <h3 className="font-semibold text-vault-text truncate">{fileName}</h3>
          </div>
          
          <div className="flex items-center gap-2 shrink-0 ml-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-vault-border hover:bg-vault-bg gap-2"
              onClick={handleDownload}
              disabled={isDownloading || !documentId}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">{isDownloading ? "Downloading..." : "Download"}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-vault-muted hover:text-vault-text"
              onClick={() => onOpenChange(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 bg-vault-bg overflow-auto flex items-center justify-center p-4 relative">
          {!documentId ? null : fileType === "PDF" ? (
            <iframe 
              src={`${fileUrl}#view=FitH`} 
              className="w-full h-full rounded bg-white" 
              title={fileName}
            />
          ) : ["JPG", "PNG", "WEBP"].includes(fileType) ? (
            <div className="relative w-full h-full flex items-center justify-center overflow-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={fileUrl} 
                alt={fileName} 
                className={`transition-all duration-200 cursor-zoom-${zoomed ? 'out' : 'in'} ${zoomed ? 'max-w-none' : 'max-w-full max-h-full object-contain'}`}
                onClick={() => setZoomed(!zoomed)}
              />
              <Button 
                variant="secondary" 
                size="icon" 
                className="absolute bottom-4 right-4 shadow-lg opacity-50 hover:opacity-100 transition-opacity"
                onClick={() => setZoomed(!zoomed)}
              >
                {zoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center max-w-sm">
              <FileTypeIcon fileType={fileType} size={80} />
              <h4 className="mt-6 mb-2 text-lg font-medium text-vault-text">Word Document</h4>
              <p className="text-sm text-vault-muted mb-8">
                Rich text document previews are not supported directly in the browser. Please download the file to view its contents.
              </p>
              <Button 
                className="bg-vault-primary text-white hover:bg-vault-primary/90 w-full max-w-xs"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Document
              </Button>
            </div>
          )}
        </div>

        {/* OCR TEXT SECTION */}
        {["JPG", "PNG", "WEBP"].includes(fileType) && (
          <div className="border-t border-vault-border bg-[#11131a] p-4 flex flex-col max-h-[250px]">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-vault-muted uppercase tracking-wider">Extracted Text</h4>
              {ocrText && (
                <Button variant="ghost" size="sm" className="h-7 text-xs px-2 text-vault-primary hover:bg-vault-primary/10" onClick={handleCopy}>
                  {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              )}
            </div>
            
            <div className="overflow-y-auto text-sm text-vault-text font-mono bg-vault-bg/30 p-3 rounded border border-vault-border/50 whitespace-pre-wrap">
              {ocrText === null ? (
                <div className="flex items-center gap-2 text-vault-muted py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  OCR processing...
                </div>
              ) : ocrText === "" ? (
                <div className="text-vault-muted italic py-2">No text detected in this image</div>
              ) : (
                ocrText
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
