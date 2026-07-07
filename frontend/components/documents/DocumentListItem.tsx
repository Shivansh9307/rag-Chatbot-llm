import clsx from "clsx";
import { FileText, X } from "lucide-react";

import type { DocumentOut } from "@/lib/types";

const STATUS_LABEL: Record<DocumentOut["status"], string> = {
  processing: "Processing…",
  ready: "Ready",
  failed: "Failed",
};

const STATUS_CLASS: Record<DocumentOut["status"], string> = {
  processing: "text-amber-600",
  ready: "text-emerald-600",
  failed: "text-red-600",
};

type DocumentListItemProps = {
  doc: DocumentOut;
  onDelete: () => void;
};

export function DocumentListItem({ doc, onDelete }: DocumentListItemProps) {
  return (
    <div className="group px-3 py-2.5 rounded-xl hover:bg-white/40 flex items-center gap-3 transition-colors text-sm font-medium text-black/80">
      <div className="bg-white/60 p-1.5 rounded-lg shadow-sm border border-white/80 shrink-0">
        <FileText className="w-4 h-4 text-blue-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate">{doc.filename}</p>
        <p className={clsx("text-xs font-normal", STATUS_CLASS[doc.status])}>
          {STATUS_LABEL[doc.status]}
          {doc.status === "ready" && ` · ${doc.chunk_count} chunks`}
        </p>
        {doc.status === "failed" && doc.error_message && (
          <p className="mt-0.5 truncate text-xs font-normal text-black/40" title={doc.error_message}>
            {doc.error_message}
          </p>
        )}
      </div>
      <button
        onClick={onDelete}
        aria-label="Delete document"
        className="shrink-0 rounded-full p-1 text-black/30 opacity-0 transition hover:bg-black/5 hover:text-black/70 group-hover:opacity-100"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
