"use client";

import { Mic, Plus, Send } from "lucide-react";
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
    <div className="w-full max-w-[700px] mx-auto mb-8 px-6 relative z-50">
      <div className="p-[2px] rounded-[2.5rem] animate-siri-glow shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-300 focus-within:shadow-[0_12px_40px_rgba(161,140,209,0.4)]">
        <div className="bg-white/70 backdrop-blur-3xl rounded-[2.5rem] flex items-end gap-3 px-6 py-3.5 border border-white/60 shadow-[inset_0_1px_4px_rgba(255,255,255,0.8)]">
          <button
            type="button"
            aria-label="Add attachment"
            className="flex-shrink-0 text-black/40 hover:text-black transition-colors p-2 -ml-2 mb-0.5 rounded-full hover:bg-black/5"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask Siri or type a prompt..."
            rows={1}
            disabled={disabled}
            className="flex-1 resize-none bg-transparent text-[1.1rem] text-black font-medium outline-none placeholder:text-black/40 leading-relaxed py-2 max-h-[150px]"
          />

          {value.trim() ? (
            <button
              onClick={handleSend}
              disabled={disabled}
              aria-label="Send"
              className="flex-shrink-0 bg-black text-white rounded-full p-2.5 mb-1 hover:scale-105 transition-transform shadow-md disabled:opacity-40"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          ) : (
            <button
              type="button"
              aria-label="Dictate"
              className="flex-shrink-0 text-black/40 hover:text-black transition-colors p-2 mb-1 rounded-full hover:bg-black/5"
            >
              <Mic className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
