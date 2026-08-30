"use client";

import { useEffect, useSyncExternalStore } from "react";

import { readConsent, serverConsent, subscribeConsent } from "@/lib/consent";

const CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

let scriptRequested = false;

/** Injected once, and only after consent — never at module scope. */
function loadAdScript() {
  if (scriptRequested || !CLIENT_ID) {
    return;
  }

  scriptRequested = true;

  const script = document.createElement("script");
  script.async = true;
  script.crossOrigin = "anonymous";
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT_ID}`;
  document.head.append(script);
}

/**
 * Renders nothing at all until NEXT_PUBLIC_ADSENSE_CLIENT is set — no box, no
 * reserved space, no placeholder. There is no AdSense account yet, and an empty
 * "Advertisement" frame is worse than no frame.
 *
 * Once the publisher ID is set the slot returns at build time, reserving its
 * height in CSS before any ad exists so the page cannot shift when one arrives.
 */
export function AdSlot({
  slotId,
  label = "Advertisement",
}: {
  slotId?: string;
  label?: string;
}) {
  const granted =
    useSyncExternalStore(subscribeConsent, readConsent, serverConsent) ===
    "granted";

  useEffect(() => {
    if (granted) {
      loadAdScript();
    }
  }, [granted]);

  // Hooks stay above this so their order never changes; CLIENT_ID is inlined
  // at build time, so this is a constant for any given deploy.
  if (!CLIENT_ID) {
    return null;
  }

  return (
    <div
      role="complementary"
      aria-label={label}
      className="my-10 flex items-center justify-center overflow-hidden border border-dashed border-rule text-micro uppercase tracking-wide text-muted"
      style={{ minHeight: "var(--ad-height-mobile)" }}
      data-ad-slot
    >
      {granted && CLIENT_ID && slotId ? (
        <ins
          className="adsbygoogle block w-full"
          data-ad-client={CLIENT_ID}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        label
      )}
    </div>
  );
}
