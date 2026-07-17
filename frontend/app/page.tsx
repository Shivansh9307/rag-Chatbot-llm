"use client";

import { useState } from "react";

import { ChatWindow } from "@/components/chat/ChatWindow";
import { LiquidToolbar } from "@/components/layout/LiquidToolbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { VibrantWallpaper } from "@/components/layout/VibrantWallpaper";
import { useDocumentsStore } from "@/store/documentsStore";
import { useSessionsStore } from "@/store/sessionsStore";

export default function Home() {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const uploadFile = useDocumentsStore((s) => s.upload);
  const deleteSession = useSessionsStore((s) => s.deleteSession);

  const handleDeleteActiveSession = async () => {
    if (!activeSessionId) return;
    await deleteSession(activeSessionId);
    setActiveSessionId(null);
  };

  return (
    <div className="fixed inset-0 font-sans selection:bg-blue-500/30 overflow-hidden">
      <VibrantWallpaper />

      <div className="absolute inset-0 flex flex-col overflow-hidden bg-white/10 backdrop-blur-2xl">
        <LiquidToolbar
          title="Chat"
          onToggleSidebar={() => setIsSidebarOpen((v) => !v)}
          onUploadFile={uploadFile}
          onDeleteSession={handleDeleteActiveSession}
          onBack={() => setActiveSessionId(null)}
          hasActiveSession={!!activeSessionId}
        />

        <div className="flex-1 flex w-full h-full overflow-hidden relative z-10">
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden shrink-0 ${
              isSidebarOpen ? "w-[280px] opacity-100" : "w-0 opacity-0"
            }`}
          >
            <Sidebar activeSessionId={activeSessionId} onSelectSession={setActiveSessionId} />
          </div>

          <div className="flex-1 flex flex-col relative h-full">
            <ChatWindow sessionId={activeSessionId} />
          </div>
        </div>
      </div>
    </div>
  );
}
