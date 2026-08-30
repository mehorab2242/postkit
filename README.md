# Postkit

Free browser-based tools for people who post. Every tool runs client-side —
no server, no uploads, no accounts.

## Running it

```bash
npm run dev
```

Build the static site:

```bash
npm run build
```

Output lands in `out/`. There is no server component to deploy — it is HTML,
CSS, JS and images.

## Tests

```bash
node --test lib/*.test.ts
```

## Adding a tool

Two files, and nothing else:

1. An entry in `lib/tools.ts`, plus its copy in `lib/content.ts`.
2. A component in `components/tools/`, registered in
   `components/tools/index.ts` along with its reserved height.

The route, sitemap entry, OG image, homepage card, footer link, related links
and JSON-LD all follow from the registry. If adding a tool ever takes more
than this, the abstraction has broken — see `rules/postkit-architecture.md`.

## Deploying to Cloudflare Pages

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `out` |
| Node version | 20 or newer |

`public/_headers` is copied into the output and sets the content type for the
generated OG images, which are emitted without a file extension.

## Environment variables

Both are optional. With neither set, no third-party script is ever requested.

| Variable | Effect |
| --- | --- |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | AdSense publisher ID. Ad units render only when this is set *and* the visitor has accepted cookies. |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Site domain for Plausible. Analytics load only after consent. |

## Before launch

Steps that need an account, so they cannot be done from here:

- [ ] Confirm `postkit.com` is available and not colliding with an existing product
- [ ] Point `CONTACT_EMAIL` in `lib/tools.ts` at a real inbox
- [ ] Submit `sitemap.xml` to Google Search Console and Bing Webmaster Tools
- [ ] Apply to AdSense, then set `NEXT_PUBLIC_ADSENSE_CLIENT` and pass real
      slot IDs to `<AdSlot />`
- [ ] Set up Plausible and set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
- [ ] Test on a real iPhone and a real Android, including a 48MP photo
- [ ] Claim the social handles
