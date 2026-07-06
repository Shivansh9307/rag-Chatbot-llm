"use client";

import { useRef, useState } from "react";

import { GlassButton } from "@/components/glass/GlassButton";

type ChatInputProps = {
  onSend: (content: string) => void;
  disabled?: boolean;
};

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  return (
    <div className="glass-panel-strong mx-4 mb-4 flex items-end gap-2 p-3">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          e.target.style.height = "auto";
          e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        placeholder="Ask a question about your documents…"
        rows={1}
        disabled={disabled}
        className="max-h-40 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:opacity-50"
      />
      <GlassButton onClick={handleSend} disabled={disabled || !value.trim()}>
        Send
      </GlassButton>
    </div>
  );
}
