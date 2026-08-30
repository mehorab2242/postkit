import type { Metadata } from "next";

import { SITE_URL } from "@/lib/tools";

export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title: `${title} | Postkit`,
    description,
    alternates: { canonical: `${SITE_URL}/${path}/` },
  };
}

/** Shared wrapper for the written pages: about, privacy, terms, contact. */
export function Prose({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="text-display font-bold tracking-tight">{title}</h1>
      {updated && (
        <p className="mt-2 font-mono text-small text-muted">
          Last updated {updated}
        </p>
      )}
      <div className="mt-8 space-y-4 [&_h2]:mt-10 [&_h2]:text-title [&_h2]:font-bold [&_li]:ml-5 [&_li]:list-disc [&_p]:text-body">
        {children}
      </div>
    </article>
  );
}
