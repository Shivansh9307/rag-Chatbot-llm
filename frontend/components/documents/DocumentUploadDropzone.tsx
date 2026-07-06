"use client";

import { useRef, useState } from "react";
import clsx from "clsx";

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
        "glass-panel glass-interactive cursor-pointer border-dashed px-4 py-6 text-center text-sm opacity-80",
        isDragging && "ring-2 ring-white/70",
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
      Drop a document here or click to upload
      <div className="mt-1 text-xs opacity-60">PDF, TXT, MD, DOCX</div>
    </div>
  );
}
