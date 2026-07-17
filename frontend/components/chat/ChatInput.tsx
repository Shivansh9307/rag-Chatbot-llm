"use client";

import { Mic, Plus, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useDocumentsStore } from "@/store/documentsStore";

type ChatInputProps = {
  onSend: (content: string) => void;
  disabled?: boolean;
};

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

function getSpeechRecognitionCtor(): (new () => SpeechRecognitionInstance) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, unknown>;
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null) as
    | (new () => SpeechRecognitionInstance)
    | null;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const isUploading = useDocumentsStore((s) => s.isUploading);
  const upload = useDocumentsStore((s) => s.upload);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = "";
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const RecognitionCtor = getSpeechRecognitionCtor();
    if (!RecognitionCtor) {
      console.warn("Voice input isn't supported in this browser.");
      return;
    }

    const recognition = new RecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setValue(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onerror = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  return (
    <div className="w-full max-w-[700px] mx-auto mb-8 px-6 relative z-50">
      <div className="siri-glow-ring rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-300 focus-within:shadow-[0_12px_40px_rgba(161,140,209,0.4)]">
        <div className="bg-white/20 backdrop-blur-[6px] backdrop-saturate-[1.8] border border-white/60 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),inset_0_-1px_0_0_rgba(255,255,255,0.3)] rounded-[2.5rem] flex items-end gap-3 px-6 py-3.5">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.md,.markdown,.docx"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            aria-label="Add document"
            className="flex-shrink-0 text-black/40 hover:text-black transition-colors p-2 -ml-2 mb-0.5 rounded-full hover:bg-black/5 disabled:opacity-40"
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
            placeholder="Ask a question about your documents..."
            rows={1}
            disabled={disabled}
            className="flex-1 resize-none bg-transparent text-[1.1rem] text-black font-medium outline-none placeholder:text-black/40 leading-relaxed py-2 max-h-[150px]"
          />

          {!isListening && value.trim() ? (
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
              onClick={toggleListening}
              aria-label={isListening ? "Stop dictation" : "Dictate"}
              className={`flex-shrink-0 transition-colors p-2 mb-1 rounded-full hover:bg-black/5 ${
                isListening ? "text-red-500 animate-pulse" : "text-black/40 hover:text-black"
              }`}
            >
              <Mic className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
