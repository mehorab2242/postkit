"use client";

import { useEffect, useState } from "react";

import { CONSENT_EVENT, readConsent } from "@/lib/consent";

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
 * The box reserves its height in CSS whether or not an ad ever loads, so the
 * page cannot shift when one arrives. The reserved element renders identically
 * on the server and the client for the same reason.
 */
export function AdSlot({
  slotId,
  label = "Advertisement",
}: {
  slotId?: string;
  label?: string;
}) {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    const sync = () => {
      const consent = readConsent();

      setGranted(consent === "granted");

      if (consent === "granted") {
        loadAdScript();
      }
    };

    sync();
    window.addEventListener(CONSENT_EVENT, sync);

    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

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
