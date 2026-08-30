import { AppLink as Link } from "@/components/ui/AppLink";

import { getTools } from "@/lib/tools";

export function RelatedTools({ slugs }: { slugs: string[] }) {
  const related = getTools(slugs);

  if (related.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="related-tools" className="mt-12">
      <h2 id="related-tools" className="text-title font-bold">
        More tools
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {related.map((tool) => (
          <li key={tool.slug}>
            <Link
              href={`/${tool.slug}/`}
              className="block h-full border border-rule p-4 hover:border-mark"
            >
              <span className="font-bold">{tool.name}</span>
              <span className="mt-1 block text-small text-muted">
                {tool.metaDescription}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
