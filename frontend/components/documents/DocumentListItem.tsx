import clsx from "clsx";

import type { DocumentOut } from "@/lib/types";

const STATUS_LABEL: Record<DocumentOut["status"], string> = {
  processing: "Processing…",
  ready: "Ready",
  failed: "Failed",
};

const STATUS_CLASS: Record<DocumentOut["status"], string> = {
  processing: "text-amber-500",
  ready: "text-emerald-500",
  failed: "text-red-500",
};

type DocumentListItemProps = {
  doc: DocumentOut;
  onDelete: () => void;
};

export function DocumentListItem({ doc, onDelete }: DocumentListItemProps) {
  return (
    <div className="glass-panel flex items-center justify-between gap-2 px-3 py-2">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{doc.filename}</p>
        <p className={clsx("text-xs", STATUS_CLASS[doc.status])}>
          {STATUS_LABEL[doc.status]}
          {doc.status === "ready" && ` · ${doc.chunk_count} chunks`}
        </p>
        {doc.status === "failed" && doc.error_message && (
          <p className="mt-1 truncate text-xs opacity-60" title={doc.error_message}>
            {doc.error_message}
          </p>
        )}
      </div>
      <button
        onClick={onDelete}
        aria-label="Delete document"
        className="shrink-0 rounded-full px-1.5 text-xs opacity-50 transition hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
}
