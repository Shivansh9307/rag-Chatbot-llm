"use client";

import { useState } from "react";

import { ChatWindow } from "@/components/chat/ChatWindow";
import { DocumentSidebar } from "@/components/documents/DocumentSidebar";
import { SessionList } from "@/components/sessions/SessionList";

export default function Home() {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  return (
    <main className="flex flex-1 gap-4 p-4">
      <aside className="glass-panel w-64 shrink-0 overflow-hidden">
        <SessionList activeSessionId={activeSessionId} onSelect={setActiveSessionId} />
      </aside>

      <section className="glass-panel flex min-w-0 flex-1 flex-col overflow-hidden">
        <ChatWindow sessionId={activeSessionId} />
      </section>

      <aside className="glass-panel w-72 shrink-0 overflow-hidden">
        <DocumentSidebar />
      </aside>
    </main>
  );
}
