/**
 * Analytics, gated on consent like everything else that phones home.
 *
 * Plausible is the provider: it is cookieless and collects no personal data,
 * which is the only kind of analytics consistent with a site whose whole
 * promise is that your files never leave your device. Set
 * NEXT_PUBLIC_PLAUSIBLE_DOMAIN to switch it on; with it unset, every call here
 * is a no-op and no script is ever requested.
 *
 * What matters most is completion, not pageviews: knowing that someone opened
 * the splitter says much less than knowing they downloaded the panels.
 */

import { readConsent } from "./consent";

const DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

type PlausibleWindow = Window & {
  plausible?: ((event: string, options?: { props?: Record<string, string> }) => void) & {
    q?: unknown[];
  };
};

let scriptRequested = false;

export function loadAnalytics(): void {
  if (scriptRequested || !DOMAIN || readConsent() !== "granted") {
    return;
  }

  scriptRequested = true;

  const target = window as PlausibleWindow;

  // Queue calls made before the script finishes loading.
  target.plausible =
    target.plausible ||
    function queued(...args: unknown[]) {
      (target.plausible!.q = target.plausible!.q || []).push(args);
    };

  const script = document.createElement("script");
  script.defer = true;
  script.dataset.domain = DOMAIN;
  // The manual variant: static export routes client-side, so pageviews are
  // sent per route rather than only on first load.
  script.src = "https://plausible.io/js/script.manual.js";
  document.head.append(script);
}

export function trackPageview(path: string): void {
  if (!DOMAIN || readConsent() !== "granted") {
    return;
  }

  (window as PlausibleWindow).plausible?.("pageview", { props: { path } });
}

/**
 * A completed job — the thing the visitor actually came to do.
 * `tool` is the slug, so each tool's success rate is visible separately.
 */
export function trackCompletion(
  tool: string,
  props: Record<string, string> = {},
): void {
  if (!DOMAIN || readConsent() !== "granted") {
    return;
  }

  (window as PlausibleWindow).plausible?.("completion", {
    props: { tool, ...props },
  });
}
