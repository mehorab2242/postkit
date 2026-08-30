import Link from "next/link";
import type { ComponentProps } from "react";

/**
 * `next/link` with prefetching off.
 *
 * Next 16.3.3 emits segment prefetch payloads as directories
 * (`…/__next.$d$slug/__PAGE__.txt`) but requests them dot-joined
 * (`…/__next.$d$slug.__PAGE__.txt`). On a Next server a rewrite reconciles the
 * two; a static host has no rewrite engine, so every prefetch 404s — a dozen
 * wasted round trips per page on mobile, and console errors that fail a
 * Lighthouse best-practices audit.
 *
 * Navigation itself is unaffected: it falls back to fetching the page. These
 * pages are small and cached at the edge, so the loss is negligible. Revisit if
 * a later Next release makes the two paths agree.
 */
export function AppLink(props: ComponentProps<typeof Link>) {
  return <Link prefetch={false} {...props} />;
}
