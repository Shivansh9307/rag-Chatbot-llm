"use client";

import { useEffect, useRef } from "react";

import { MessageBubble } from "@/components/chat/MessageBubble";
import { StreamingCursor } from "@/components/chat/StreamingCursor";
import type { ChatMessageOut } from "@/lib/types";

type MessageListProps = {
  messages: ChatMessageOut[];
  isStreaming: boolean;
  streamingText: string;
};

export function MessageList({ messages, isStreaming, streamingText }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  return (
    <div className="flex-1 overflow-y-auto pb-32 flex flex-col scroll-smooth pt-8">
      {messages.length === 0 && !isStreaming && (
        <div className="apple-glass-base mx-auto max-w-md rounded-[1.5rem] px-6 py-8 text-center text-sm text-black/60">
          Upload a document and ask a question to get started.
        </div>
      )}

      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          role={message.role}
          content={message.content}
          citations={message.citations}
        />
      ))}

      {isStreaming && (
        <MessageBubble role="assistant" content={streamingText}>
          <StreamingCursor />
        </MessageBubble>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
