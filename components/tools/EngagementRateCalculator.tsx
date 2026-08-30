"use client";

import { useMemo, useState } from "react";

import { CopyButton } from "@/components/ui/CopyButton";
import { NumberInput } from "@/components/ui/NumberInput";

/**
 * Rough industry ranges. They differ by platform and by whoever published the
 * study, so they are presented as typical, not authoritative.
 */
const TIERS = [
  { limit: 10_000, label: "under 10k followers", range: "4–6%", low: 4, high: 6 },
  { limit: 50_000, label: "10k–50k followers", range: "2–4%", low: 2, high: 4 },
  {
    limit: 500_000,
    label: "50k–500k followers",
    range: "1.5–3%",
    low: 1.5,
    high: 3,
  },
  {
    limit: Number.POSITIVE_INFINITY,
    label: "500k+ followers",
    range: "1–2%",
    low: 1,
    high: 2,
  },
];

function tierFor(followers: number) {
  return TIERS.find((tier) => followers < tier.limit) ?? TIERS[TIERS.length - 1];
}

function verdict(rate: number, tier: (typeof TIERS)[number]) {
  if (rate >= tier.high) {
    return "above average";
  }

  if (rate >= tier.low) {
    return "in the normal range";
  }

  return "below average";
}

export default function EngagementRateCalculator() {
  const [followers, setFollowers] = useState("");
  const [likes, setLikes] = useState("");
  const [comments, setComments] = useState("");

  const result = useMemo(() => {
    const followerCount = Number(followers);
    const likeCount = Number(likes) || 0;
    const commentCount = Number(comments) || 0;

    if (!followerCount || followerCount <= 0) {
      return null;
    }

    const raw = ((likeCount + commentCount) / followerCount) * 100;

    if (!Number.isFinite(raw)) {
      return null;
    }

    // Cap absurd input rather than rendering a 4000% result.
    const rate = Math.min(raw, 100);
    const tier = tierFor(followerCount);

    return {
      rate,
      tier,
      followerCount,
      verdict: verdict(rate, tier),
    };
  }, [followers, likes, comments]);

  const shareLine = result
    ? `Engagement rate: ${result.rate.toFixed(1)}% (${result.followerCount.toLocaleString("en-US")} followers)`
    : "";

  return (
    <div className="p-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <NumberInput
          label="Followers"
          value={followers}
          onChange={setFollowers}
          placeholder="12400"
        />
        <NumberInput
          label="Average likes"
          value={likes}
          onChange={setLikes}
          placeholder="380"
        />
        <NumberInput
          label="Average comments"
          value={comments}
          onChange={setComments}
          placeholder="24"
        />
      </div>

      <p className="mt-3 text-small text-muted">
        Take your last 9 to 12 posts and divide the totals by the number of
        posts.
      </p>

      <div aria-live="polite" className="mt-6">
        {result ? (
          <div className="border border-rule p-5">
            <p className="font-mono text-display font-bold text-mark">
              {result.rate.toFixed(1)}%
            </p>
            <p className="mt-2">
              That is {result.verdict} for accounts {result.tier.label}, where{" "}
              <span className="font-mono">{result.tier.range}</span> is typical.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-rule pt-4">
              <code className="font-mono text-small text-muted">{shareLine}</code>
              <CopyButton
                text={shareLine}
                label="Copy for your media kit"
                className="border border-rule"
              />
            </div>
          </div>
        ) : (
          <p className="border border-dashed border-rule p-5 text-muted">
            Enter your follower count to see your rate.
          </p>
        )}
      </div>

      <p className="mt-4 text-small text-muted">
        Smaller accounts genuinely engage better — a 5% rate at 3,000 followers
        and a 1.5% rate at 300,000 are both healthy.
      </p>
    </div>
  );
}
