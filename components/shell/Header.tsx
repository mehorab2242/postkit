import Link from "next/link";

import { CropMark } from "@/components/ui/CropMark";
import { tools } from "@/lib/tools";

export function Header() {
  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-[1.125rem] font-bold tracking-tight"
        >
          <CropMark className="text-mark" />
          Postkit
        </Link>
        <nav aria-label="Tools">
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-small text-muted">
            {tools.slice(0, 3).map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={`/${tool.slug}/`}
                  className="inline-flex min-h-11 items-center hover:text-ink"
                >
                  {tool.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
