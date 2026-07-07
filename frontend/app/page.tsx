"use client";

import { useState } from "react";

import { ChatWindow } from "@/components/chat/ChatWindow";
import { LiquidToolbar } from "@/components/layout/LiquidToolbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { VibrantWallpaper } from "@/components/layout/VibrantWallpaper";

export default function Home() {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 font-sans selection:bg-blue-500/30 overflow-hidden">
      <VibrantWallpaper />

      <div className="absolute inset-4 rounded-[2rem] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.2),0_0_0_1px_rgba(255,255,255,0.4)] overflow-hidden bg-white/10 backdrop-blur-2xl border border-white/40">
        <LiquidToolbar title="RAG Chat" />

        <div className="flex-1 flex w-full h-full overflow-hidden relative z-10">
          <Sidebar activeSessionId={activeSessionId} onSelectSession={setActiveSessionId} />

          <div className="flex-1 flex flex-col relative h-full">
            <ChatWindow sessionId={activeSessionId} />
          </div>
        </div>
      </div>
    </div>
  );
}
