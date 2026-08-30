"use client";

import { useSyncExternalStore } from "react";
import { AppLink as Link } from "@/components/ui/AppLink";

import {
  readConsent,
  serverConsent,
  subscribeConsent,
  writeConsent,
} from "@/lib/consent";

/**
 * Nothing that tracks anyone loads until this is answered. The banner is
 * deliberately dismissible in both directions — "no thanks" is a real choice
 * that is remembered, not a nag that returns on the next page.
 */
export function ConsentBanner() {
  const consent = useSyncExternalStore(
    subscribeConsent,
    readConsent,
    serverConsent,
  );

  /* "unknown" is the hydration snapshot, so server and client agree on
     rendering nothing; the banner appears on the re-render that follows. */
  if (consent !== null) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie choices"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-rule bg-paper p-4"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-small">
          Postkit is free because of ads. Personalised ads use cookies — your
          photos never do, they stay on your device either way.{" "}
          <Link href="/privacy/" className="underline">
            Privacy
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => writeConsent("denied")}
            className="min-h-11 border border-rule px-4 text-small font-bold"
          >
            No thanks
          </button>
          <button
            type="button"
            onClick={() => writeConsent("granted")}
            className="min-h-11 bg-mark-ink px-4 text-small font-bold text-white"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
