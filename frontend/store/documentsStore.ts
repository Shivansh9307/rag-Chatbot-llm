import { create } from "zustand";

import { deleteDocument, listDocuments, uploadDocument } from "@/lib/api/documents";
import type { DocumentOut } from "@/lib/types";

type DocumentsState = {
  documents: DocumentOut[];
  isUploading: boolean;
  fetchDocuments: () => Promise<void>;
  upload: (file: File) => Promise<void>;
  remove: (documentId: string) => Promise<void>;
};

export const useDocumentsStore = create<DocumentsState>((set, get) => ({
  documents: [],
  isUploading: false,

  fetchDocuments: async () => {
    const documents = await listDocuments();
    set({ documents });
  },

  upload: async (file) => {
    set({ isUploading: true });
    try {
      await uploadDocument(file);
      await get().fetchDocuments();
    } finally {
      set({ isUploading: false });
    }
  },

  remove: async (documentId) => {
    await deleteDocument(documentId);
    await get().fetchDocuments();
  },
}));
