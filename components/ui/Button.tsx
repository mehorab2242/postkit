import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

/** Touch targets are never below 44px — accessibility floor, not a preference. */
export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex min-h-11 items-center justify-center gap-2 px-4 text-body font-bold disabled:opacity-40 disabled:cursor-not-allowed";
  const styles =
    variant === "primary"
      ? "bg-mark text-white hover:opacity-90"
      : "border border-rule text-ink hover:border-ink";

  return <button className={`${base} ${styles} ${className}`} {...props} />;
}
