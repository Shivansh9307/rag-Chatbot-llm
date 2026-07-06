"use client";

import { useEffect } from "react";

import { ChatInput } from "@/components/chat/ChatInput";
import { MessageList } from "@/components/chat/MessageList";
import { listMessages } from "@/lib/api/sessions";
import { useChatStream } from "@/lib/hooks/useChatStream";
import type { ChatMessageOut } from "@/lib/types";
import { useChatStore } from "@/store/chatStore";

type ChatWindowProps = {
  sessionId: string | null;
};

const EMPTY_MESSAGES: ChatMessageOut[] = [];

export function ChatWindow({ sessionId }: ChatWindowProps) {
  const messages = useChatStore((s) =>
    sessionId ? (s.messagesBySession[sessionId] ?? EMPTY_MESSAGES) : EMPTY_MESSAGES,
  );
  const isStreaming = useChatStore((s) => s.isStreaming);
  const streamingText = useChatStore((s) => s.streamingText);
  const setMessages = useChatStore((s) => s.setMessages);
  const { sendMessage, error } = useChatStream(sessionId);

  useEffect(() => {
    if (!sessionId) return;
    listMessages(sessionId).then((msgs) => setMessages(sessionId, msgs));
  }, [sessionId, setMessages]);

  if (!sessionId) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="glass-panel px-8 py-10 text-center text-sm opacity-70">
          Select or start a new chat to begin.
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <MessageList
        messages={messages}
        isStreaming={isStreaming}
        streamingText={streamingText}
      />
      {error && (
        <div className="glass-panel mx-4 mb-2 px-4 py-2 text-sm text-red-500">
          {error}
        </div>
      )}
      <ChatInput onSend={sendMessage} disabled={isStreaming} />
    </div>
  );
}
