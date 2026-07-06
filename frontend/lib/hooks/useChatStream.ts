"use client";

import { useCallback, useState } from "react";

import { streamMessage } from "@/lib/api/chat";
import type { ChatMessageOut } from "@/lib/types";
import { useChatStore } from "@/store/chatStore";

export function useChatStream(sessionId: string | null) {
  const [error, setError] = useState<string | null>(null);
  const appendMessage = useChatStore((s) => s.appendMessage);
  const startStreaming = useChatStore((s) => s.startStreaming);
  const appendStreamToken = useChatStore((s) => s.appendStreamToken);
  const finishStreaming = useChatStore((s) => s.finishStreaming);
  const failStreaming = useChatStore((s) => s.failStreaming);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!sessionId) return;
      setError(null);

      const userMessage: ChatMessageOut = {
        id: `local-${Date.now()}`,
        session_id: sessionId,
        role: "user",
        content,
        citations: null,
        created_at: new Date().toISOString(),
      };
      appendMessage(sessionId, userMessage);
      startStreaming();

      await streamMessage(sessionId, content, {
        onToken: (delta) => appendStreamToken(delta),
        onDone: (messageId, citations) => {
          finishStreaming(sessionId, {
            id: messageId,
            session_id: sessionId,
            role: "assistant",
            content: useChatStore.getState().streamingText,
            citations,
            created_at: new Date().toISOString(),
          });
        },
        onError: (message) => {
          setError(message);
          failStreaming();
        },
      });
    },
    [sessionId, appendMessage, startStreaming, appendStreamToken, finishStreaming, failStreaming],
  );

  return { sendMessage, error };
}
