/**
 * Consent state. No ad or analytics script may fire before this says granted —
 * that is a hard rule, and the banner is the only thing that can change it.
 */

export const CONSENT_KEY = "postkit:consent";
export const CONSENT_EVENT = "postkit:consent-change";

/**
 * `null` means the visitor has been asked and has not chosen. `"unknown"` is
 * the server/hydration snapshot: storage has not been read yet, so nothing that
 * depends on the answer may render.
 */
export type Consent = "granted" | "denied" | null | "unknown";

export function readConsent(): Consent {
  try {
    const stored = window.localStorage.getItem(CONSENT_KEY);

    return stored === "granted" || stored === "denied" ? stored : null;
  } catch {
    // Storage blocked: treat as undecided, which means nothing loads.
    return null;
  }
}

export function writeConsent(value: "granted" | "denied"): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Not persisting is survivable; the choice still applies to this page.
  }

  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

/**
 * Subscribe to consent changes. Consent lives in localStorage, which is
 * external to React, so it is read through useSyncExternalStore rather than
 * copied into state by an effect. The server snapshot is always `null`:
 * undecided, which is what makes the markup match on hydration.
 */
export function subscribeConsent(onChange: () => void): () => void {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);

  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function serverConsent(): Consent {
  return "unknown";
}
