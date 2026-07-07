import clsx from "clsx";
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

  return (
    <div className={clsx("flex w-full mb-6", isUser ? "justify-end" : "justify-center")}>
      <div
        className={clsx(
          "px-6 py-5 text-[1.05rem] leading-relaxed transition-all duration-300",
          isUser
            ? "apple-glass-pill max-w-[70%]"
            : "apple-glass-panel rounded-3xl max-w-[85%] w-[800px]",
        )}
      >
        <div className="prose prose-invert prose-p:leading-relaxed max-w-none [&>p]:m-0 text-white/90 font-medium">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>

        {children}

        {citations && citations.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-white/10">
            {citations.map((citation, i) => (
              <span
                key={`${citation.document_id}-${i}`}
                className="bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md border border-white/20 rounded-lg px-3 py-1 text-xs text-white/80 cursor-pointer flex items-center gap-1"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                {citation.filename}
                {citation.page_number ? ` · p.${citation.page_number}` : ""}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
