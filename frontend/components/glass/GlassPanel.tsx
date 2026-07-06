import clsx from "clsx";
import type { ElementType, ReactNode } from "react";

type GlassPanelProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  strong?: boolean;
};

export function GlassPanel({
  as: Component = "div",
  children,
  className,
  strong = false,
}: GlassPanelProps) {
  return (
    <Component
      className={clsx(strong ? "glass-panel-strong" : "glass-panel", className)}
    >
      {children}
    </Component>
  );
}
