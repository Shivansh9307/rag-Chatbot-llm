import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type GlassButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "pill" | "panel";
};

export function GlassButton({
  className,
  variant = "pill",
  ...props
}: GlassButtonProps) {
  return (
    <button
      className={clsx(
        "glass-interactive px-4 py-2 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed",
        variant === "pill" ? "glass-pill" : "glass-panel",
        className,
      )}
      {...props}
    />
  );
}
