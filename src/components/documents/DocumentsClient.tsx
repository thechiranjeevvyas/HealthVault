"use client";

import { useState, useMemo } from "react";
import { FileText, Database, FileBox, Search } from "lucide-react";
import { DocumentWithEvent, MemberWithStats } from "@/types";
import { getFileSizeFormatted } from "@/lib/utils";
import DocumentCard from "./DocumentCard";
import EmptyState from "@/components/shared/EmptyState";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface Props {
  documents: DocumentWithEvent[];
  stats: {
    totalCount: number;
    totalSize: number;
    byType: Record<string, number>;
  };
  members: MemberWithStats[];
}

export default function DocumentsClient({ documents: initialDocuments, stats, members }: Props) {
  const [documents, setDocuments] = useState(initialDocuments);
  
  const [memberFilter, setMemberFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const mostCommonType = useMemo(() => {
    let max = 0;
    let type = "";
    Object.entries(stats.byType).forEach(([k, v]) => {
      if (v > max) { max = v; type = k; }
    });
    return type ? `${max} ${type}s` : "No files";
  }, [stats]);

  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const matchMember = memberFilter === "ALL" || doc.memberId === memberFilter;
      const matchType = typeFilter === "ALL" || doc.fileType === typeFilter;
      const matchSearch = doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchMember && matchType && matchSearch;
    });
  }, [documents, memberFilter, typeFilter, searchQuery]);

  const handleDelete = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <h1 className="text-2xl font-bold text-vault-text">Documents</h1>

      {/* STAT PILLS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-vault-surface border border-vault-border rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-vault-primary/10 rounded-lg text-vault-primary">
            <FileBox className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-vault-muted">Total Documents</p>
            <p className="text-2xl font-bold text-vault-text">{stats.totalCount}</p>
          </div>
        </div>
        <div className="bg-vault-surface border border-vault-border rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-vault-success/10 rounded-lg text-vault-success">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-vault-muted">Storage Used</p>
            <p className="text-2xl font-bold text-vault-text">{getFileSizeFormatted(stats.totalSize)}</p>
          </div>
        </div>
        <div className="bg-vault-surface border border-vault-border rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-vault-warning/10 rounded-lg text-vault-warning">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-vault-muted">Most Common</p>
            <p className="text-2xl font-bold text-vault-text">{mostCommonType}</p>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-vault-surface border border-vault-border rounded-xl p-3 flex flex-wrap items-center gap-3">
        <div className="w-full sm:w-48 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-vault-muted" />
          <Input 
            placeholder="Search files..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-vault-bg border-vault-border"
          />
        </div>
        
        <div className="w-full sm:w-48">
          <Select value={memberFilter} onValueChange={(v) => v && setMemberFilter(v)}>
            <SelectTrigger className="bg-vault-bg border-vault-border">
              <SelectValue placeholder="All Members" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Members</SelectItem>
              {members.map(m => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-48">
          <Select value={typeFilter} onValueChange={(v) => v && setTypeFilter(v)}>
            <SelectTrigger className="bg-vault-bg border-vault-border">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="PDF">PDF Documents</SelectItem>
              <SelectItem value="JPG">JPG Images</SelectItem>
              <SelectItem value="PNG">PNG Images</SelectItem>
              <SelectItem value="WEBP">WEBP Images</SelectItem>
              <SelectItem value="DOCX">Word Documents</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* GRID */}
      {documents.length === 0 ? (
        <div className="bg-vault-surface border border-vault-border rounded-xl">
          <EmptyState
            icon={FileText}
            title="No documents yet"
            description="Upload lab reports, prescriptions, and scans from any medical event. They will appear here."
          />
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="text-center py-12 text-vault-muted bg-vault-surface border border-vault-border rounded-xl">
          No documents match your search or filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredDocs.map(doc => (
            <DocumentCard key={doc.id} document={doc} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
