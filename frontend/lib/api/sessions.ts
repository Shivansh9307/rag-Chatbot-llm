import { apiFetch } from "@/lib/api/client";
import type { ChatMessageOut, ChatSessionOut } from "@/lib/types";

export function listSessions() {
  return apiFetch<ChatSessionOut[]>("/sessions");
}

export function createSession() {
  return apiFetch<ChatSessionOut>("/sessions", { method: "POST" });
}

export function deleteSession(sessionId: string) {
  return apiFetch<void>(`/sessions/${sessionId}`, { method: "DELETE" });
}

export function listMessages(sessionId: string) {
  return apiFetch<ChatMessageOut[]>(`/sessions/${sessionId}/messages`);
}
