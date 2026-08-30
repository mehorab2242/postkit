/**
 * The signature element: prepress registration marks. `CropMark` is the brand
 * glyph (all four corners); `CropFrame` brackets a working canvas with them.
 */
export function CropMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M1 5V1h4M11 1h4v4M15 11v4h-4M5 15H1v-4" />
    </svg>
  );
}

function Corner({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute h-3 w-3 border-mark ${className}`}
    />
  );
}

export function CropFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative p-2">
      <Corner className="left-0 top-0 border-l-2 border-t-2" />
      <Corner className="right-0 top-0 border-r-2 border-t-2" />
      <Corner className="bottom-0 right-0 border-b-2 border-r-2" />
      <Corner className="bottom-0 left-0 border-b-2 border-l-2" />
      {children}
    </div>
  );
}
