import { create } from "zustand";

import { createSession, deleteSession, listSessions } from "@/lib/api/sessions";
import type { ChatSessionOut } from "@/lib/types";

type SessionsState = {
  sessions: ChatSessionOut[];
  fetchSessions: () => Promise<ChatSessionOut[]>;
  createSession: () => Promise<ChatSessionOut>;
  deleteSession: (sessionId: string) => Promise<void>;
};

export const useSessionsStore = create<SessionsState>((set, get) => ({
  sessions: [],

  fetchSessions: async () => {
    const sessions = await listSessions();
    set({ sessions });
    return sessions;
  },

  createSession: async () => {
    const session = await createSession();
    await get().fetchSessions();
    return session;
  },

  deleteSession: async (sessionId) => {
    await deleteSession(sessionId);
    await get().fetchSessions();
  },
}));
