/**
 * Consent state. No ad or analytics script may fire before this says granted —
 * that is a hard rule, and the banner is the only thing that can change it.
 */

export const CONSENT_KEY = "postkit:consent";
export const CONSENT_EVENT = "postkit:consent-change";

export type Consent = "granted" | "denied" | null;

export function readConsent(): Consent {
  try {
    const stored = window.localStorage.getItem(CONSENT_KEY);

    return stored === "granted" || stored === "denied" ? stored : null;
  } catch {
    // Storage blocked: treat as undecided, which means nothing loads.
    return null;
  }
}

export function writeConsent(value: Exclude<Consent, null>): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Not persisting is survivable; the choice still applies to this page.
  }

  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}
