"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { SessionListItem } from "@/components/sessions/SessionListItem";
import { createSession, deleteSession, listSessions } from "@/lib/api/sessions";
import type { ChatSessionOut } from "@/lib/types";

type SessionListProps = {
  activeSessionId: string | null;
  onSelect: (sessionId: string) => void;
};

export function SessionList({ activeSessionId, onSelect }: SessionListProps) {
  const [sessions, setSessions] = useState<ChatSessionOut[]>([]);

  const refresh = async () => {
    const result = await listSessions();
    setSessions(result);
    return result;
  };

  useEffect(() => {
    let ignore = false;
    listSessions().then((result) => {
      if (!ignore) setSessions(result);
    });
    return () => {
      ignore = true;
    };
  }, []);

  const handleNewSession = async () => {
    const session = await createSession();
    await refresh();
    onSelect(session.id);
  };

  const handleDelete = async (sessionId: string) => {
    await deleteSession(sessionId);
    const result = await refresh();
    if (activeSessionId === sessionId && result.length > 0) {
      onSelect(result[0].id);
    }
  };

  return (
    <div className="p-4 mt-auto">
      <div className="mb-3 flex items-center justify-between px-2">
        <h3 className="text-xs font-bold text-black/40 uppercase tracking-wider">
          Recent Chats
        </h3>
        <button
          onClick={handleNewSession}
          aria-label="New chat"
          className="rounded-full p-1 text-black/40 transition hover:bg-black/5 hover:text-black/70"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-1">
        {sessions.map((session) => (
          <SessionListItem
            key={session.id}
            session={session}
            active={session.id === activeSessionId}
            onSelect={() => onSelect(session.id)}
            onDelete={() => handleDelete(session.id)}
          />
        ))}
      </div>
    </div>
  );
}
