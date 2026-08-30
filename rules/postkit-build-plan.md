# Postkit — Build Plan

**Free browser-based tools for social media creators.**

**Stack:** Next.js (App Router, static export) · Tailwind · Cloudflare Pages
**Domain:** postkit.com *(verify availability + check for existing products before committing)*
**Model:** Free client-side tools, ad-supported
**Build:** ~1 week across 5 sprints · **Traffic:** 3–6 months

---

## Product principles

These three decide whether Postkit works. Everything else is detail.

1. **Nothing leaves the browser.** All processing is client-side. Zero server cost per user, and "your files never leave your device" is Postkit's strongest differentiator against the incumbents.
2. **Content ships in the server-rendered HTML.** Not injected by JavaScript. Static export gives you this — verify by viewing source, not by trusting it.
3. **Mobile first, genuinely.** The audience is on phones, often mid-range Android. Desktop is the secondary case.

**Naming constraint:** never put Insta, Gram, Reel, Tok, Face, or Book in the brand, domain, or social handles. Meta and ByteDance file UDRP complaints and win. Tool *pages* targeting "Instagram carousel splitter" as a keyword are fine — that's descriptive use.

---

## Sprint 0 — Foundation

**Goal:** A deployable shell where adding a tool is one config entry plus one component.

The two things that are expensive to change later — URL structure and the shell — both land here. Don't rush this sprint to get to the fun part.

### Setup

```bash
npx create-next-app@latest postkit --typescript --tailwind --app
```

`next.config.js`:

```js
module.exports = {
  output: 'export',
  images: { unoptimized: true },  // required for static export
  trailingSlash: true,             // consistent URLs, no redirect chains
}
```

`output: 'export'` produces pure static HTML. No server, no serverless functions, no runtime cost.

### Lock the URLs

Flat, keyword-matching, no nesting:

```
postkit.com/carousel-splitter/
postkit.com/instagram-grid-planner/
postkit.com/engagement-rate-calculator/
postkit.com/fancy-text-generator/
postkit.com/profile-picture-cropper/
```

Not `/tools/carousel-splitter`. No query parameters. Changing these after you rank costs the rankings.

### The tool registry — the maintainability answer

One file, `lib/tools.ts`. Everything else derives from it.

```ts
export const tools = [
  {
    slug: 'carousel-splitter',
    name: 'Carousel Splitter',
    h1: 'Split an Image into an Instagram Carousel',
    metaTitle: 'Free Carousel Splitter — Split Photos into Panels | Postkit',
    metaDescription: 'Cut a wide image into perfectly aligned carousel panels. Free, no upload, runs in your browser.',
    category: 'image',
    related: ['instagram-grid-planner', 'profile-picture-cropper'],
    intro: '...',       // 1–2 sentences above the tool
    body: '...',        // ~400 words below it
    howTo: [ { step: 'Upload your image', detail: '...' } ],
    faq: [ { q: '...', a: '...' } ],
  },
]
```

Sitemap, sidebar links, homepage grid, nav, and JSON-LD all read from this array.

### The shell

- Header, footer, related-tools sidebar
- **Ad slot containers with fixed heights reserved in CSS.** Ads that push content down on load wreck Cumulative Layout Shift, which is a ranking factor. Reserve the space before the ad exists.
- One shared page template consuming a registry entry

### Page layout order (SEO and UX both depend on this)

```
H1
Short intro (1–2 sentences)
[THE TOOL]              ← must be above the fold at 375px
Ad slot
How to use
Body content (~400 words)
FAQ
Related tools
```

If someone has to scroll past an ad to reach the tool they came for, they bounce — and the bounce tells Google the page is bad.

### Definition of done

- [ ] Deploys to Cloudflare Pages
- [ ] One placeholder tool renders fully from a registry entry
- [ ] Adding a second entry produces a complete page with no other file edits
- [ ] Layout verified on a real phone

> **Checkpoint:** if adding a tool means editing four files, the abstraction is wrong. Fix it now, not in Sprint 1.

---

## Sprint 1 — The five tools

**Goal:** All five working, mobile-tested, no server calls.

Easiest first, so you find the shared patterns before you're locked into them.

### 1. Engagement rate calculator *(half day)*
Pure math, no file handling. Warm-up for the page template.
Inputs: followers, avg likes, avg comments → ER% plus a plain-English benchmark ("2.1% — above average for your follower range").

### 2. Carousel splitter *(1 day)*
Canvas slicing + JSZip. The real work is edge cases:
- Non-standard aspect ratios — letterbox or crop when it doesn't divide evenly? Offer both.
- Preview with cut lines **before** download
- Panel count selector (2–10)
- Numbered filenames so upload order is obvious

### 3. Grid planner *(1 day)*
Drag-to-reorder 3-column grid.

**Use a touch-capable drag library** (`dnd-kit` or similar). Native HTML5 drag-and-drop does nothing on mobile — this silently breaks your primary platform.

### 4. Fancy text generator *(half day)*
Character map + ~80 Unicode variants, tap-to-copy per row.

Add a one-line note: these are Unicode substitutions, not fonts — screen readers read them as noise and some platforms strip them from search. Costs nothing, and it's the kind of honesty that gets a tool recommended.

### 5. Profile picture cropper *(half day)*
Round preview, square export, zoom and reposition.

### Deferred: caption burner

Different business model. Needs transcription (real per-minute cost), and `ffmpeg.wasm` multithreaded requires `SharedArrayBuffer` → cross-origin isolation headers → **which break most third-party ad scripts.** If built later, make it the paid tool on a subdomain, not an ad page.

### Rules for every tool

- Downscale large images before canvas ops — mobile Safari crashes on very large canvases
- **Dynamic-import heavy libraries.** JSZip is ~100kb; load it on download click, not page load. This matters more than framework choice.
- Handle HEIC input (iPhone default), or detect and message clearly
- Respect EXIF orientation or photos come out sideways
- Zero network requests after page load

### Definition of done

- [ ] All five work end to end on a real phone
- [ ] Lighthouse performance green on each
- [ ] No tool makes a network request after load

---

## Sprint 2 — SEO

**Goal:** Every page rankable and indexable.

The sprint that decides whether any of this works, and the one that's easiest to skip.

### Per page

- 400–600 words below the tool + 4–6 FAQ entries answering real search queries. Thin pages don't rank, and AdSense rejects thin sites.
- Unique title and meta description, one H1, canonical URL, OG image
- JSON-LD: `SoftwareApplication`, `FAQPage`, `HowTo`

Write for the person who landed from a search, not for a crawler. Keyword filler fails both.

### Site level

- `sitemap.xml` generated from the registry
- `robots.txt`
- Homepage linking all five tools with real descriptions
- 3 related-tool links in the sidebar of every page — this is how tool five inherits the authority tool one earns

### Definition of done

- [ ] View source on a built page shows body content and FAQ in raw HTML
- [ ] Schema validates in Google's Rich Results Test
- [ ] Sitemap lists all pages with correct canonical URLs

---

## Sprint 3 — Ads, legal, mobile polish

**Goal:** AdSense-eligible and legally clear.

### Before any ad script fires

- Cookie consent banner. You're targeting US and EU traffic (that's where the rates are), so GDPR consent is mandatory.
- Privacy policy, terms, about, contact. **AdSense checks for these and rejects sites without them.**

### Mobile — test on a real device, not devtools

- File inputs behave differently on iOS Safari
- Touch targets ≥44px
- **Zip downloads on iOS land in the Files app** — tell the user, or they think it failed
- Canvas crashes on large images — downscale first
- Drag needs touch events

### Desktop

Wider layout, keyboard support, drag-and-drop file input. Secondary, but shouldn't feel like a stretched phone page.

### Definition of done

- [ ] Consent banner blocks ad scripts until accepted
- [ ] All four legal pages live and linked in the footer
- [ ] Full pass on a real iPhone and a real Android

---

## Sprint 4 — Launch

**Goal:** Indexed, measurable, monetization submitted.

- Lighthouse on every page — green Core Web Vitals. Ranking factors, and far easier to fix before ads and analytics are layered on.
- Submit sitemap to Google Search Console **and** Bing Webmaster Tools
- Analytics with **per-route tracking.** In three months one tool will pull most of your traffic — you need to see which. Cheap now, annoying to retrofit.
- Track completion, not just pageviews: did they actually download the zip?
- Apply to AdSense. Days to weeks, possible first rejection — normal, usually fixable.
- Claim @postkit on Instagram, TikTok, and X

### Definition of done

- [ ] All pages indexed in Search Console
- [ ] Per-route analytics confirmed firing
- [ ] AdSense application submitted

---

## Sprint 5+ — Growth *(ongoing, months not days)*

The build is a week. **Ranking is three to six months.** Everything here is Search Console work:

- Which queries actually bring people in (often not the ones you targeted)
- Pages with impressions but no clicks → rewrite title and meta description
- Which tool is pulling ahead → build more in that direction

**Give it 8 weeks before judging anything.** New domains sit in a slow patch regardless of quality. Early silence is not a signal.

### Marketing

Five separate campaigns even though they shipped together — each tool is its own keyword cluster and audience. Start with carousel splitter and grid planner: thinner competitive fields, faster read on whether anything works.

The fancy text generator SERP is owned by sites with a decade of backlinks. It'll come eventually, not in month one. Don't read its early silence as failure.

### The stacking roadmap

Image compressor · HEIC to JPG · hashtag counter · aspect ratio resizer (Reels / feed / story) · video to GIF · link-in-bio builder (the eventual paid product)

Each addition should be: registry entry, component, content. If it's more than that, revisit the abstraction.

---

## Honest risks

- **Ad revenue is slow.** 6–12 months to meaningful money, and it rides on SEO, which isn't an engineering skill.
- **All five tools already exist.** Postkit's edge is execution: fast, clean, mobile-first, not ad-choked, no server upload. That's real — most incumbents fail on all four — but it's the only edge you have.
- **AI search is eating simple-answer queries.** Interactive tools survive far better than content sites, which is why this is the right category. But the category is shrinking, not growing.
- **AdSense rates track audience geography.** US and EU traffic pays several times what South Asian traffic does. Same pageviews, very different revenue.
- **Cloudflare Pages over Vercel.** Vercel's free tier caps bandwidth and overages get expensive. If Postkit works you want a lot of traffic, and traffic is the thing that would bill you. Verify current terms on both — they change.
