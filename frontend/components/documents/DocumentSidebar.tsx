"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { DocumentListItem } from "@/components/documents/DocumentListItem";
import { DocumentUploadDropzone } from "@/components/documents/DocumentUploadDropzone";
import {
  deleteDocument,
  listDocuments,
  uploadDocument,
} from "@/lib/api/documents";
import type { DocumentOut } from "@/lib/types";

const POLL_INTERVAL_MS = 2000;

export function DocumentSidebar() {
  const [documents, setDocuments] = useState<DocumentOut[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    const result = await listDocuments();
    setDocuments(result);
    return result;
  }, []);

  useEffect(() => {
    let ignore = false;
    listDocuments().then((result) => {
      if (!ignore) setDocuments(result);
    });
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const hasProcessing = documents.some((d) => d.status === "processing");
    if (hasProcessing && !pollRef.current) {
      pollRef.current = setInterval(refresh, POLL_INTERVAL_MS);
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
  }, [documents, refresh]);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      await uploadDocument(file);
      await refresh();
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    await deleteDocument(documentId);
    await refresh();
  };

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <h2 className="px-1 text-sm font-semibold opacity-80">Documents</h2>
      <DocumentUploadDropzone onUpload={handleUpload} disabled={isUploading} />
      <div className="flex-1 space-y-2 overflow-y-auto">
        {documents.map((doc) => (
          <DocumentListItem key={doc.id} doc={doc} onDelete={() => handleDelete(doc.id)} />
        ))}
      </div>
    </div>
  );
}
