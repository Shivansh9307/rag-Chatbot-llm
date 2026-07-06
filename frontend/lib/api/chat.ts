import { API_BASE_URL } from "@/lib/api/client";
import type { Citation } from "@/lib/types";

type StreamCallbacks = {
  onToken: (delta: string) => void;
  onDone: (messageId: string, citations: Citation[]) => void;
  onError: (message: string) => void;
};

export async function streamMessage(
  sessionId: string,
  content: string,
  callbacks: StreamCallbacks,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/sessions/${sessionId}/messages`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    },
  );

  if (!response.ok || !response.body) {
    const detail = await response.json().catch(() => null);
    callbacks.onError(detail?.detail ?? "Failed to send message");
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const rawEvent of events) {
      const line = rawEvent.trim();
      if (!line.startsWith("data:")) continue;

      const payload = JSON.parse(line.slice(5).trim());

      if (payload.error) {
        callbacks.onError(payload.error);
        return;
      }
      if (payload.done) {
        callbacks.onDone(payload.message_id, payload.citations ?? []);
        return;
      }
      if (typeof payload.delta === "string") {
        callbacks.onToken(payload.delta);
      }
    }
  }
}
