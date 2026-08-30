import { AppLink as Link } from "@/components/ui/AppLink";

import { SITE_URL, tools } from "@/lib/tools";

export const metadata = {
  alternates: { canonical: `${SITE_URL}/` },
};

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="text-display font-bold tracking-tight">
        Free tools for people who post
      </h1>
      <p className="mt-3 text-lead text-muted">
        Split a carousel, plan a grid, crop an avatar. Every tool runs in your
        browser, so your photos never leave your device — and nothing asks you
        to sign up.
      </p>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <li key={tool.slug}>
            <Link
              href={`/${tool.slug}/`}
              className="block h-full border border-rule p-5 hover:border-mark"
            >
              <span className="text-lead font-bold">{tool.name}</span>
              <span className="mt-2 block text-muted">{tool.intro}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
