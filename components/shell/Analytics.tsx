"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { loadAnalytics, trackPageview } from "@/lib/analytics";
import { readConsent, serverConsent, subscribeConsent } from "@/lib/consent";
import { useSyncExternalStore } from "react";

/**
 * Per-route pageviews. Static export routes on the client, so without this only
 * the first page of a visit would ever be counted — and knowing which tool
 * pulls the traffic is the entire point of measuring.
 */
export function Analytics() {
  const pathname = usePathname();
  const granted =
    useSyncExternalStore(subscribeConsent, readConsent, serverConsent) ===
    "granted";

  useEffect(() => {
    if (!granted) {
      return;
    }

    loadAnalytics();
    trackPageview(pathname);
  }, [granted, pathname]);

  return null;
}
