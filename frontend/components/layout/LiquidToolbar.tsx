"use client";

import { ArrowLeft, ChevronDown, Folder, Trash2 } from "lucide-react";
import { useRef } from "react";

type LiquidToolbarProps = {
  title: string;
  onToggleSidebar: () => void;
  onUploadFile: (file: File) => void;
  onDeleteSession: () => void;
  onBack: () => void;
  hasActiveSession: boolean;
};

export function LiquidToolbar({
  title,
  onToggleSidebar,
  onUploadFile,
  onDeleteSession,
  onBack,
  hasActiveSession,
}: LiquidToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUploadFile(file);
    e.target.value = "";
  };

  return (
    <div className="h-16 w-full border-b border-black/5 flex items-center justify-between px-6 bg-white/30 backdrop-blur-md z-30 shrink-0">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle chat history"
          className="apple-glass-group py-1 px-3"
        >
          <span className="text-sm font-semibold text-black/80">{title}</span>
          <ChevronDown className="w-4 h-4 text-black/50 ml-1" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.md,.markdown,.docx"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="apple-glass-group">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Add file"
            className="apple-icon-btn px-3"
          >
            <Folder className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        <div className="apple-glass-group">
          <button
            type="button"
            onClick={onDeleteSession}
            disabled={!hasActiveSession}
            aria-label="Delete chat"
            className="apple-icon-btn px-3 disabled:opacity-40 disabled:pointer-events-none"
          >
            <Trash2 className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        <div className="apple-glass-group">
          <button
            type="button"
            onClick={onBack}
            disabled={!hasActiveSession}
            aria-label="Go back"
            className="apple-icon-btn px-3 disabled:opacity-40 disabled:pointer-events-none"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2]" />
          </button>
        </div>
      </div>
    </div>
  );
}
