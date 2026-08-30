import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdSlot } from "@/components/shell/AdSlot";
import { RelatedTools } from "@/components/shell/RelatedTools";
import { ToolIsland } from "@/components/tools/ToolIsland";
import { faqSchema, howToSchema, softwareApplicationSchema } from "@/lib/schema";
import { SITE_URL, getTool, tools } from "@/lib/tools";

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);

  if (!tool) {
    return {};
  }

  const url = `${SITE_URL}/${tool.slug}/`;

  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: tool.metaTitle,
      description: tool.metaDescription,
      url,
      type: "website",
    },
  };
}

export default async function ToolPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const tool = getTool(slug);

  if (!tool) {
    notFound();
  }

  const url = `${SITE_URL}/${tool.slug}/`;
  const schemas = [
    softwareApplicationSchema({
      name: tool.name,
      description: tool.metaDescription,
      url,
    }),
    howToSchema({ name: tool.h1, steps: tool.howTo }),
    ...(tool.faq.length > 0 ? [faqSchema({ items: tool.faq })] : []),
  ];

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="text-display font-bold tracking-tight">{tool.h1}</h1>
      <p className="mt-3 text-lead text-muted">{tool.intro}</p>

      <ToolIsland slug={tool.slug} />

      <AdSlot />

      <section aria-labelledby="how-to">
        <h2 id="how-to" className="text-title font-bold">
          How to use it
        </h2>
        <ol className="mt-4 space-y-4">
          {tool.howTo.map((item, index) => (
            <li key={item.step} className="flex gap-3">
              <span className="font-mono text-small text-mark">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="block font-bold">{item.step}</span>
                <span className="block text-muted">{item.detail}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      {tool.body.length > 0 && (
        <>
          <hr className="cut-line my-10" />
          <section className="space-y-4">
            {tool.body.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </section>
        </>
      )}

      {tool.faq.length > 0 && (
        <>
          <hr className="cut-line my-10" />
          <section aria-labelledby="faq">
            <h2 id="faq" className="text-title font-bold">
              Questions
            </h2>
            <dl className="mt-4 space-y-6">
              {tool.faq.map((item) => (
                <div key={item.q}>
                  <dt className="font-bold">{item.q}</dt>
                  <dd className="mt-1 text-muted">{item.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        </>
      )}

      <RelatedTools slugs={tool.related} />

      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </article>
  );
}
