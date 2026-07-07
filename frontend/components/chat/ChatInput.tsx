"use client";

import { useRef, useState } from "react";

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
    <div className="w-full max-w-2xl mx-auto mb-8 px-4 relative z-50">
      <div className="p-[2px] rounded-[2rem] animate-siri-glow shadow-[0_0_40px_rgba(255,255,255,0.1)]">
        <div className="bg-[#1a1a1c]/90 backdrop-blur-3xl rounded-[2rem] flex items-center gap-3 px-6 py-3">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
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
            className="flex-1 resize-none bg-transparent text-lg text-white/90 outline-none placeholder:text-white/40 leading-relaxed py-1"
          />
          <button
            onClick={handleSend}
            disabled={disabled || !value.trim()}
            aria-label="Send"
            className="flex-shrink-0 text-white/60 hover:text-white transition-colors disabled:opacity-30"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 19V5" />
              <path d="M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
