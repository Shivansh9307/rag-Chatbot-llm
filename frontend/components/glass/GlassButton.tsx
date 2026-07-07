import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type GlassButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "pill" | "panel" | "toolbar";
};

export function GlassButton({
  className,
  variant = "pill",
  ...props
}: GlassButtonProps) {
  return (
    <button
      className={clsx(
        "transition-all duration-200 ease-out disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center",
        variant === "pill" &&
          "apple-glass-pill px-5 py-2.5 text-sm font-semibold hover:bg-white/20 hover:scale-105 active:scale-95",
        variant === "panel" &&
          "apple-glass-panel rounded-2xl px-4 py-3 text-sm font-medium hover:bg-white/5",
        variant === "toolbar" &&
          "bg-white/80 backdrop-blur-xl text-black hover:bg-white rounded-full p-2 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
