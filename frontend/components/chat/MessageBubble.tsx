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
    <div className={clsx("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={clsx(
          "max-w-[75%] px-4 py-3 text-[0.95rem] leading-relaxed",
          isUser ? "glass-pill" : "glass-panel",
        )}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:m-0">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        {children}
        {citations && citations.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {citations.map((citation, i) => (
              <span
                key={`${citation.document_id}-${i}`}
                className="glass-pill px-2 py-0.5 text-xs opacity-80"
              >
                {citation.filename}
                {citation.page_number ? `, p.${citation.page_number}` : ""}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
