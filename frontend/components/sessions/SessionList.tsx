"use client";

import { Plus } from "lucide-react";
import { useEffect } from "react";

import { SessionListItem } from "@/components/sessions/SessionListItem";
import { useSessionsStore } from "@/store/sessionsStore";

type SessionListProps = {
  activeSessionId: string | null;
  onSelect: (sessionId: string) => void;
};

export function SessionList({ activeSessionId, onSelect }: SessionListProps) {
  const sessions = useSessionsStore((s) => s.sessions);
  const fetchSessions = useSessionsStore((s) => s.fetchSessions);
  const createSession = useSessionsStore((s) => s.createSession);
  const deleteSession = useSessionsStore((s) => s.deleteSession);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleNewSession = async () => {
    const session = await createSession();
    onSelect(session.id);
  };

  const handleDelete = async (sessionId: string) => {
    await deleteSession(sessionId);
    const remaining = useSessionsStore.getState().sessions;
    if (activeSessionId === sessionId && remaining.length > 0) {
      onSelect(remaining[0].id);
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
