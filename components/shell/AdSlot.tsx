/**
 * Reserves its height in CSS before any ad exists. Nothing loads here until
 * consent is granted (see ConsentBanner) — the box just holds the space so the
 * page never shifts.
 */
export function AdSlot({ label = "Advertisement" }: { label?: string }) {
  return (
    <div
      role="complementary"
      aria-label={label}
      className="my-10 flex items-center justify-center border border-dashed border-rule text-micro uppercase tracking-wide text-muted"
      style={{ minHeight: "var(--ad-height-mobile)" }}
      data-ad-slot
    >
      {label}
    </div>
  );
}
