"use client";

import { useEffect, useRef } from "react";

import { DocumentListItem } from "@/components/documents/DocumentListItem";
import { DocumentUploadDropzone } from "@/components/documents/DocumentUploadDropzone";
import { useDocumentsStore } from "@/store/documentsStore";

const POLL_INTERVAL_MS = 2000;

export function DocumentSidebar() {
  const documents = useDocumentsStore((s) => s.documents);
  const isUploading = useDocumentsStore((s) => s.isUploading);
  const fetchDocuments = useDocumentsStore((s) => s.fetchDocuments);
  const upload = useDocumentsStore((s) => s.upload);
  const remove = useDocumentsStore((s) => s.remove);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    const hasProcessing = documents.some((d) => d.status === "processing");
    if (hasProcessing && !pollRef.current) {
      pollRef.current = setInterval(fetchDocuments, POLL_INTERVAL_MS);
    }
    if (!hasProcessing && pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [documents, fetchDocuments]);

  return (
    <div className="p-4">
      <h3 className="text-xs font-bold text-black/40 uppercase tracking-wider mb-3 px-2">
        Knowledge Base
      </h3>
      <div className="mb-2 px-0">
        <DocumentUploadDropzone onUpload={upload} disabled={isUploading} />
      </div>
      <div className="space-y-1">
        {documents.map((doc) => (
          <DocumentListItem key={doc.id} doc={doc} onDelete={() => remove(doc.id)} />
        ))}
      </div>
    </div>
  );
}
