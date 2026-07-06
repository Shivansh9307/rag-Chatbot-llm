import clsx from "clsx";

import { GlassCard } from "@/components/glass/GlassCard";
import type { ChatSessionOut } from "@/lib/types";

type SessionListItemProps = {
  session: ChatSessionOut;
  active: boolean;
  onSelect: () => void;
  onDelete: () => void;
};

export function SessionListItem({ session, active, onSelect, onDelete }: SessionListItemProps) {
  return (
    <div className="group relative">
      <GlassCard onClick={onSelect} active={active}>
        <span className={clsx("block truncate pr-6 text-sm", active && "font-medium")}>
          {session.title}
        </span>
      </GlassCard>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        aria-label="Delete session"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-1.5 text-xs opacity-0 transition hover:opacity-100 group-hover:opacity-60"
      >
        ✕
      </button>
    </div>
  );
}
