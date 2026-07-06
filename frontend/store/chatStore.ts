import { create } from "zustand";

import type { ChatMessageOut } from "@/lib/types";

type ChatState = {
  messagesBySession: Record<string, ChatMessageOut[]>;
  streamingText: string;
  isStreaming: boolean;
  setMessages: (sessionId: string, messages: ChatMessageOut[]) => void;
  appendMessage: (sessionId: string, message: ChatMessageOut) => void;
  startStreaming: () => void;
  appendStreamToken: (delta: string) => void;
  finishStreaming: (sessionId: string, message: ChatMessageOut) => void;
  failStreaming: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
  messagesBySession: {},
  streamingText: "",
  isStreaming: false,

  setMessages: (sessionId, messages) =>
    set((state) => ({
      messagesBySession: { ...state.messagesBySession, [sessionId]: messages },
    })),

  appendMessage: (sessionId, message) =>
    set((state) => ({
      messagesBySession: {
        ...state.messagesBySession,
        [sessionId]: [...(state.messagesBySession[sessionId] ?? []), message],
      },
    })),

  startStreaming: () => set({ isStreaming: true, streamingText: "" }),

  appendStreamToken: (delta) =>
    set((state) => ({ streamingText: state.streamingText + delta })),

  finishStreaming: (sessionId, message) =>
    set((state) => ({
      isStreaming: false,
      streamingText: "",
      messagesBySession: {
        ...state.messagesBySession,
        [sessionId]: [...(state.messagesBySession[sessionId] ?? []), message],
      },
    })),

  failStreaming: () => set({ isStreaming: false, streamingText: "" }),
}));
