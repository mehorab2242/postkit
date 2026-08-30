# Postkit — Architecture & Ruleset

Standing constraints for the project. When a decision is unclear, this file decides it.

---

## Part 1 — Architecture

### The one abstraction that matters

Adding a tool must cost **one registry entry plus one component**. Every structural decision below serves that. If a change makes adding tool number twelve more expensive, the change is wrong.

### Directory structure

```
postkit/
├── app/
│   ├── layout.tsx           # shell: header, footer, consent banner
│   ├── page.tsx             # homepage — renders the registry
│   ├── [slug]/page.tsx      # THE ONLY tool route
│   ├── privacy/ terms/ about/ contact/
│   ├── sitemap.ts           # generated from registry
│   └── robots.ts
├── components/
│   ├── shell/               # Header, Footer, RelatedTools, AdSlot, ConsentBanner
│   ├── ui/                  # Button, NumberInput, FileDrop, CopyButton, CropFrame
│   └── tools/
│       ├── index.ts         # slug → component map
│       └── *.tsx            # one per tool
├── lib/
│   ├── tools.ts             # THE REGISTRY
│   ├── loadImage.ts
│   ├── download.ts
│   ├── copy.ts
│   └── schema.ts            # JSON-LD builders
└── styles/tokens.css
```

### One dynamic route, statically generated

`app/[slug]/page.tsx` is the only tool page that exists. It reads the registry, generates every path at build time, and renders the shared template.

```tsx
export function generateStaticParams() {
  return tools.map(t => ({ slug: t.slug }))
}

export function generateMetadata({ params }) {
  const tool = getTool(params.slug)
  return { title: tool.metaTitle, description: tool.metaDescription, ... }
}
```

Five URLs, one file. Tool six is a registry entry and a component — no new route.

### The islands split — this is the core of the design

**Content renders on the server. The tool hydrates on the client.**

```tsx
// app/[slug]/page.tsx  — server component
<h1>{tool.h1}</h1>
<p>{tool.intro}</p>

<ToolIsland slug={tool.slug} />      {/* client-only */}

<AdSlot />
<HowTo steps={tool.howTo} />          {/* static HTML */}
<Body content={tool.body} />          {/* static HTML */}
<Faq items={tool.faq} />              {/* static HTML */}
<RelatedTools slugs={tool.related} />
```

The tool components load through `next/dynamic` with `ssr: false` — they're canvas and file APIs, there's nothing to server-render, and skipping it keeps the JS off pages until needed.

**Everything Google needs is in the static HTML. Only the interactive widget costs JavaScript.** Get this backwards — content injected client-side — and the site does not rank, which makes the entire project pointless.

### Import boundaries

| Layer | May import | Must never import |
|---|---|---|
| `lib/` | nothing internal | components, app, the registry |
| `components/ui/` | `lib/` | tools, shell, registry |
| `components/tools/` | `lib/`, `components/ui/` | shell, registry, ads |
| `components/shell/` | `lib/`, `ui/`, registry | tools |
| `app/` | everything | — |

**Tool components know nothing about ads, SEO, or the registry.** They take props, do their job, render their own UI. That's what keeps them testable and portable, and it's what stops a change to the ad layout from breaking the splitter.

Only `app/` and `components/shell/` read the registry.

### The registry entry shape

```ts
type Tool = {
  slug: string          // = URL path, IMMUTABLE after publish
  name: string
  h1: string
  metaTitle: string     // ≤60 chars
  metaDescription: string  // ≤155 chars
  category: 'image' | 'text' | 'calculator'
  related: string[]     // exactly 3 slugs
  intro: string         // 1–2 sentences, above the tool
  body: string          // 400–600 words, below it
  howTo: { step: string; detail: string }[]
  faq: { q: string; a: string }[]
  published: string     // ISO date
}
```

### Static export constraints

`output: 'export'` means no API routes, no middleware, no server actions, no `next/image` optimization, no ISR. That's the intended trade: zero runtime cost and it deploys anywhere.

If something later genuinely needs a server, it goes in a separate serverless function — it does not become a reason to abandon static export.

---

## Part 2 — Hard rules

Non-negotiable. A pull request breaking any of these doesn't merge.

1. **No network requests from tool code.** After page load, tools work fully offline. This is the product promise and the cost model at once.
2. **No backend, no database, no API routes, no user accounts.**
3. **Heavy libraries are dynamic-imported at point of use.** JSZip on download click. `heic2any` on HEIC detect. Never at module top.
4. **Body content, FAQ, and how-to render in server HTML.** Verify with view-source, not with faith.
5. **URLs are immutable once published.** A slug change means a permanent redirect and a ranking hit. Get it right before publish.
6. **No trademarked terms in brand, domain, or handles.** No Insta, Gram, Reel, Tok, Face, Book. Tool pages may target those words as descriptive keywords in titles and copy — the brand may not.
7. **Ad slots reserve their height in CSS before the ad loads.**
8. **No ad or analytics script fires before consent.**
9. **User images never leave the device.** Not for analytics, not for error reporting, not for "improving the tool."

---

## Part 3 — Performance budget

Enforced per page. Blowing the budget is a bug, not a trade-off.

| Metric | Ceiling |
|---|---|
| Initial JS (gzipped) | 100kb |
| LCP on 4G | 2.5s |
| CLS | 0.1 |
| Tool interactive | 2s from load |
| Font files | 2 |

Check the bundle before every deploy. The usual culprit is a library that crept into a top-level import.

---

## Part 4 — Accessibility floor

Not aspirational — these ship at launch.

- Every control reachable and operable by keyboard
- Visible focus rings, never `outline: none` without a replacement
- Touch targets ≥44×44px
- Every input has a real `<label>`
- Canvas tools have a text description of their state for screen readers
- `prefers-reduced-motion` respected
- Contrast ≥4.5:1 for text

---

## Part 5 — SEO invariants

- Exactly one `<h1>` per page
- Unique title and meta description, from the registry
- Canonical URL on every page
- `SoftwareApplication` + `HowTo` + `FAQPage` JSON-LD, validated
- Every page in the sitemap, generated — never hand-maintained
- Three related-tool links per page, so new tools inherit authority

---

## Part 6 — Design system

The design brief: the UI wraps around the user's own photos. Anything loud competes with their images. So the chrome is near-monochrome and disciplined, and all the boldness goes into one accent used only for actions.

### Tokens

```css
--paper:  #FAFAF9;   /* background */
--ink:    #16161A;   /* primary text */
--muted:  #6E6E76;   /* secondary text */
--rule:   #E4E4E1;   /* borders, cut lines */
--mark:   #FF0080;   /* accent — actions only */
```

`--mark` is a prepress registration magenta. The vernacular is deliberate: these tools crop, slice and align images, which is print production work, and registration marks are that trade's visual language. It's also nowhere near the hues in typical user photos, so it never gets lost against an uploaded image.

Use `--mark` for primary actions and active states only. Never as a background fill, never decoratively. One accent, spent carefully.

### Type

Two families, because the performance budget allows two font files.

- **Space Grotesk** — display and UI. Technical, slightly mechanical, carries the prepress register without costing legibility.
- **Space Mono** — numbers only: pixel dimensions, panel counts, percentages. Data reads as data.

Scale: 32 / 24 / 18 / 16 / 14 / 12. Body never below 16px on mobile.

### Signature element: the crop frame

Corner registration marks bracket the working canvas in every image tool. Section dividers are a thin dashed cut-line rule, not a plain `<hr>`.

This is structure encoding meaning rather than decorating it — the marks describe what the product does. It's also the one memorable thing, so nothing else gets to be loud.

### Motion

Almost none. One exception: on the splitter, cut lines animate into position when the preview renders. It shows the tool doing its actual job. Everything else is instant.

---

## Part 7 — Interface copy

- Active voice. Buttons name the outcome: **Split image**, not *Submit*. **Download 3 panels**, not *Export*.
- A control keeps its name through the whole flow. "Split image" produces "3 panels ready."
- Errors give the fix: *"This image is too small to split into 6 panels. Try 3, or use a wider image."* Never *"Invalid input."*
- Empty states invite: *"Add a photo to get started."*
- Sentence case throughout. No exclamation marks.

---

## Part 8 — Refactor triggers

Stop and fix when any of these appear:

- Adding a tool touches more than the registry and one component
- The same logic exists in two tool components → it belongs in `lib/`
- A tool component imports from `shell/` → the boundary broke
- Initial JS crosses 100kb → find the top-level import
- A registry field is used by only one tool → it's a component prop, not registry data
- You want a server for something → check whether it can run client-side first; it usually can
