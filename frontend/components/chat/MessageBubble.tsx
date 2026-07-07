import { FileText, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

import type { Citation } from "@/lib/types";

type MessageBubbleProps = {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[] | null;
  children?: React.ReactNode;
};

export function MessageBubble({ role, content, citations, children }: MessageBubbleProps) {
  const isUser = role === "user";

  if (isUser) {
    return (
      <div className="flex w-full justify-end mb-8 px-8 relative z-10">
        <div className="bg-[#007AFF] shadow-[0_4px_16px_rgba(0,122,255,0.3),inset_0_1px_2px_rgba(255,255,255,0.4)] px-6 py-3.5 max-w-[70%] text-white text-[1.05rem] font-medium tracking-wide rounded-[1.5rem] rounded-br-[0.5rem]">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-start mb-12 px-8 relative z-10">
      <div className="apple-glass-base rounded-[2rem] rounded-tl-[0.75rem] p-8 max-w-[85%] w-[800px]">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-black/50">
            Apple Intelligence
          </span>
        </div>

        <div className="prose prose-p:leading-relaxed max-w-none [&>p]:m-0 text-black/90 text-[1.05rem] font-medium">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>

        {children}

        {citations && citations.length > 0 && (
          <div className="mt-6 pt-5 border-t border-black/10 flex flex-wrap gap-2">
            {citations.map((citation, i) => (
              <button
                key={`${citation.document_id}-${i}`}
                className="bg-white/50 hover:bg-white/80 border border-white/60 shadow-sm backdrop-blur-md transition-all rounded-lg px-3 py-1.5 text-xs text-black/80 font-medium flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 opacity-70" />
                <span>{citation.filename}</span>
                {citation.page_number && (
                  <span className="opacity-50 ml-1">p.{citation.page_number}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
