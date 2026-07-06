import { apiFetch } from "@/lib/api/client";
import type { DocumentOut } from "@/lib/types";

export function listDocuments() {
  return apiFetch<DocumentOut[]>("/documents");
}

export function getDocument(documentId: string) {
  return apiFetch<DocumentOut>(`/documents/${documentId}`);
}

export function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return apiFetch<DocumentOut>("/documents/upload", {
    method: "POST",
    body: formData,
  });
}

export function deleteDocument(documentId: string) {
  return apiFetch<void>(`/documents/${documentId}`, { method: "DELETE" });
}
