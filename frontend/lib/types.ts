export type DocumentStatus = "processing" | "ready" | "failed";

export type DocumentOut = {
  id: string;
  filename: string;
  content_type: string;
  file_ext: string;
  size_bytes: number;
  status: DocumentStatus;
  error_message: string | null;
  chunk_count: number;
  created_at: string;
  updated_at: string;
};

export type ChatSessionOut = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

export type Citation = {
  document_id: string;
  filename: string;
  page_number: number | null;
  similarity: number;
};

export type ChatMessageOut = {
  id: string;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  citations: Citation[] | null;
  created_at: string;
};
