"use client";

import { useEffect, useState } from "react";

import { GlassButton } from "@/components/glass/GlassButton";
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
    <div className="flex h-full flex-col gap-3 p-4">
      <GlassButton variant="panel" onClick={handleNewSession} className="w-full">
        + New chat
      </GlassButton>
      <div className="flex-1 space-y-2 overflow-y-auto">
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
