import Link from "next/link";

import { tools } from "@/lib/tools";

const legalPages = [
  { href: "/about/", label: "About" },
  { href: "/privacy/", label: "Privacy" },
  { href: "/terms/", label: "Terms" },
  { href: "/contact/", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-rule">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:grid-cols-2">
        <nav aria-label="All tools">
          <h2 className="text-small font-bold uppercase tracking-wide text-muted">
            Tools
          </h2>
          <ul className="mt-3 space-y-1">
            {tools.map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={`/${tool.slug}/`}
                  className="inline-flex min-h-11 items-center text-body hover:text-mark"
                >
                  {tool.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Site">
          <h2 className="text-small font-bold uppercase tracking-wide text-muted">
            Postkit
          </h2>
          <ul className="mt-3 space-y-1">
            {legalPages.map((page) => (
              <li key={page.href}>
                <Link
                  href={page.href}
                  className="inline-flex min-h-11 items-center text-body hover:text-mark"
                >
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-10 text-small text-muted">
        <p>
          Every tool here runs in your browser. Your files are never uploaded to
          a server.
        </p>
        <p className="mt-2">© {new Date().getFullYear()} Postkit</p>
      </div>
    </footer>
  );
}
