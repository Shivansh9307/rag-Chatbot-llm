"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { UploadCloud } from "lucide-react";

type DocumentUploadDropzoneProps = {
  onUpload: (file: File) => void;
  disabled?: boolean;
};

export function DocumentUploadDropzone({ onUpload, disabled }: DocumentUploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    onUpload(files[0]);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      className={clsx(
        "cursor-pointer rounded-xl border border-dashed border-black/15 px-3 py-4 text-center text-xs font-medium text-black/50 transition-colors hover:bg-white/40",
        isDragging && "bg-white/50 border-black/30",
        disabled && "pointer-events-none opacity-40",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.txt,.md,.markdown,.docx"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        disabled={disabled}
      />
      <UploadCloud className="mx-auto mb-1 w-4 h-4 text-black/40" />
      Drop a document or click to upload
      <div className="mt-0.5 opacity-70">PDF, TXT, MD, DOCX</div>
    </div>
  );
}
