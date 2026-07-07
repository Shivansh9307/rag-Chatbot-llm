import { DocumentSidebar } from "@/components/documents/DocumentSidebar";
import { SessionList } from "@/components/sessions/SessionList";

type SidebarProps = {
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
};

export function Sidebar({ activeSessionId, onSelectSession }: SidebarProps) {
  return (
    <div className="w-[280px] h-full border-r border-black/5 bg-white/20 backdrop-blur-sm flex flex-col shrink-0 overflow-y-auto">
      <DocumentSidebar />
      <SessionList activeSessionId={activeSessionId} onSelect={onSelectSession} />
    </div>
  );
}
