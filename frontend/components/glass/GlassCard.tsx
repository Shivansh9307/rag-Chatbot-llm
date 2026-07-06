import clsx from "clsx";
import type { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  active?: boolean;
};

export function GlassCard({ children, className, onClick, active }: GlassCardProps) {
  const Component = onClick ? "button" : "div";

  return (
    <Component
      onClick={onClick}
      className={clsx(
        "glass-panel glass-interactive w-full px-4 py-3 text-left",
        onClick && "cursor-pointer",
        active && "ring-2 ring-white/70",
        className,
      )}
    >
      {children}
    </Component>
  );
}
