import clsx from "clsx";
import { MessageSquare, X } from "lucide-react";

import type { ChatSessionOut } from "@/lib/types";

type SessionListItemProps = {
  session: ChatSessionOut;
  active: boolean;
  onSelect: () => void;
  onDelete: () => void;
};

export function SessionListItem({ session, active, onSelect, onDelete }: SessionListItemProps) {
  return (
    <div
      onClick={onSelect}
      className={clsx(
        "group px-3 py-2 rounded-xl cursor-pointer flex items-center gap-3 transition-colors text-sm font-medium",
        active ? "bg-black/5 text-black" : "hover:bg-white/40 text-black/70",
      )}
    >
      <MessageSquare className="w-4 h-4 opacity-50 shrink-0" />
      <span className="truncate flex-1">{session.title}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        aria-label="Delete session"
        className="shrink-0 rounded-full p-1 text-black/30 opacity-0 transition hover:bg-black/5 hover:text-black/70 group-hover:opacity-100"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
