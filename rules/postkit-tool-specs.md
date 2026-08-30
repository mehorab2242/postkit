# Postkit — Tool Build Specs

Step-by-step build for each of the five launch tools. Build the shared layer first — four of the five depend on it.

---

## Shared layer (build before any tool)

Three utilities that every image tool uses. Getting these right once saves you fixing the same bug four times.

### `lib/loadImage.ts`

One function: `File` → a clean, orientation-corrected, safely-sized bitmap.

```
loadImage(file) →
  1. Validate type. Accept image/jpeg, image/png, image/webp, image/heic.
  2. If HEIC → convert or reject with a clear message (see below).
  3. Decode via createImageBitmap(file, { imageOrientation: 'from-image' })
  4. Check dimensions against the mobile ceiling; downscale if over.
  5. Return { bitmap, width, height }
```

**EXIF orientation.** `createImageBitmap` with `imageOrientation: 'from-image'` handles this natively and is supported across current browsers. Use it. The alternative — parsing EXIF yourself and applying a canvas transform — is 100 lines you don't need.

**The mobile canvas ceiling.** iOS Safari caps total canvas area, historically around 16.7M pixels (roughly 4096×4096). Exceed it and the canvas silently returns blank — no error, just a white image, which is miserable to debug. Downscale any input above ~4000px on the long edge before drawing. Test this on a real iPhone with a 48MP photo; it's the single most likely thing to break in production.

**HEIC.** iPhone's default format. Browsers can't decode it natively. Options:
- `heic2any` — works, but it's a heavy library. Dynamic-import it only when a HEIC file is actually detected.
- Or detect and show: *"iPhone HEIC photos aren't supported yet. In Settings → Camera → Formats, choose Most Compatible, or share the photo to convert it to JPG."*

Ship the detect-and-explain version for launch. Add conversion later if the analytics show people hitting it. Detection: check the file's magic bytes rather than trusting the extension — read the first 12 bytes and look for `ftyp` followed by `heic`/`heix`/`mif1`.

### `lib/download.ts`

```
downloadBlob(blob, filename)   // single file
downloadZip(files[])           // dynamic-import JSZip here, not at module top
```

JSZip is ~100kb. Import it inside the function so it only loads when someone actually clicks download.

### `lib/copy.ts`

`navigator.clipboard.writeText` with a `document.execCommand('copy')` fallback. Clipboard API needs HTTPS and, on Safari, must fire inside a direct user gesture — don't call it after an `await`.

---

## 1. Engagement rate calculator

Half a day. No file handling, so it's the right place to shake out the page template.

### Steps

1. Three number inputs: followers, average likes, average comments.
2. Calculate live on change. No submit button.
   ```
   ER = ((avgLikes + avgComments) / followers) × 100
   ```
3. Show the result to one decimal place, plus a benchmark for their follower tier.
4. Copy button that copies a pitch-ready line: `"Engagement rate: 3.2% (12,400 followers)"`. Influencers paste this into brand emails — that's the actual job of this tool.

### Benchmark tiers

Rough industry ranges, and they differ by platform and by whoever published the study. Present them as approximate, not authoritative:

| Followers | Typical range |
|---|---|
| Under 10k | 4–6% |
| 10k–50k | 2–4% |
| 50k–500k | 1.5–3% |
| 500k+ | 1–2% |

Smaller accounts genuinely engage better — say so on the page, because it's the counterintuitive fact that makes the tool feel useful rather than mechanical.

### Edge cases

- Zero or empty followers → show nothing, not `NaN` or `Infinity`
- Strip commas from pasted numbers (people paste `12,400`)
- Cap absurd input rather than rendering a 4000% result

### Content angle

The FAQ writes itself: what's a good engagement rate, why did mine drop, does it count views, do saves and shares matter. Those are real queries with real volume.

---

## 2. Carousel splitter

One day. The most valuable tool here and the one with the most edge cases.

### Steps

1. File input → `loadImage()`
2. Panel count selector, 2–10. Default 3.
3. **Panel aspect ratio selector** — this is the decision that makes or breaks the output:
   - `1:1` square (1080×1080)
   - `4:5` portrait (1080×1350) — most feed real estate, the one most people want
4. Compute the crop geometry (below).
5. Render a preview with cut lines drawn over the image, before any download.
6. On download: draw each panel to its own canvas, `toBlob` at JPEG quality 0.92, zip, download.
7. Filenames must be `01.jpg`, `02.jpg` … Zero-padded, or the phone's gallery sorts `10` before `2` and the carousel uploads in the wrong order.

### The geometry problem

The source almost never divides evenly into N panels of the target ratio. Three ways out — offer the first two:

**Crop to fill.** Compute the total width needed for N panels at the target ratio, centre-crop the source to that, then slice. Clean output, loses edges. Default to this.

**Fit with padding.** Scale the whole image to fit inside N panels, pad the remainder. Nothing lost, but you get bars. Let the user pick the pad colour — white and black cover almost everything.

**Sub-pixel drift.** Track slice boundaries as floats and round only at draw time, and force the final panel's right edge to the exact image edge. Otherwise rounding accumulates and you get a 1–2px seam that's invisible in preview and obvious in the published carousel.

```
sliceWidth = croppedWidth / panelCount        // float, don't round
panel[i].sx = Math.round(i * sliceWidth)
panel[i].sw = Math.round((i + 1) * sliceWidth) - panel[i].sx
```

### Output sizing

Draw each panel at exactly 1080×1080 or 1080×1350 regardless of source size. Upscaling a small source is better than shipping panels at inconsistent dimensions.

### Copy that matters

Under the download button: *"Upload in order — 01 first."* Most support questions about carousel tools are people who uploaded them shuffled.

---

## 3. Grid planner

One day. The mobile drag interaction is the whole risk.

### Steps

1. Multi-file input, up to 18 images.
2. Load each through `loadImage()`, generate a small thumbnail (canvas-resize to ~300px) and hold it in state. Don't render 18 full-resolution bitmaps — that's what kills the page on a phone.
3. Render as a 3-column grid, newest-first, matching Instagram's layout.
4. Drag to reorder.
5. Persist to `localStorage` so a refresh or an accidental back-swipe doesn't wipe their planning. Store thumbnails as data URLs, and cap the count — localStorage limits are around 5MB per origin.
6. "Clear all" button.

### The drag library

Use **`dnd-kit`** with both `PointerSensor` and `TouchSensor` registered. Native HTML5 drag-and-drop does not fire on touch devices — if you build with it, the tool works perfectly on your laptop and does nothing on the phones that are your entire audience.

Set an activation constraint on the touch sensor (~200ms delay or 8px tolerance) so vertical page scrolling still works. Without it, every scroll attempt picks up a tile and the page feels broken.

### Detail worth adding

A toggle for the 3:4 crop preview — Instagram now renders feed thumbnails taller than square, so a square preview lies about what people will actually see. Small thing, and it's the kind of accuracy that gets a tool bookmarked.

---

## 4. Fancy text generator

Half a day of work, plus real care on the character maps.

### Steps

1. Text input, live output.
2. For each style, map input characters through a lookup table.
3. Render each style as a row with a tap-to-copy button and a "Copied" confirmation.
4. Lazy-render below the fold — 80 styles × a long input is a lot of DOM.

### Iterate by code point, not by character

Most of these live in Mathematical Alphanumeric Symbols (U+1D400–U+1D7FF), which is outside the Basic Multilingual Plane. Each character is a surrogate pair, so `str[i]` and `str.length` will corrupt them.

```js
[...input].map(ch => map[ch] ?? ch).join('')
```

`Array.from` / spread iterate by code point. Always fall through to the original character when a style has no mapping.

### The holes — this will catch you out

The Mathematical Alphanumeric block has **reserved gaps** where Unicode already had the character in Letterlike Symbols. Script capital B is not at `U+1D49D` (reserved) — it's at `U+212C`. Same for E, F, H, I, L, M, R and lowercase e, g, o. Fraktur and double-struck have their own gaps.

So you cannot generate these maps with a simple offset loop. Either use a maintained package, or hand-build the maps and **write a test that renders all 62 characters (A–Z, a–z, 0–9) in every style** and flags any that fall through to plain. Ten minutes of testing against a bug that's very hard to spot by eye.

### Style groups

Bold · italic · bold italic · script · bold script · fraktur · double-struck · monospace · sans variants · circled · squared · fullwidth · small caps · upside down (reverse the string too) · strikethrough and underline (combining marks appended per character).

### The honesty note

One line on the page: these are Unicode substitutions, not fonts. Screen readers read them as symbol names, and some platforms strip them from search. Costs nothing, and it's what gets a tool recommended over the twenty identical competitors.

---

## 5. Profile picture cropper

Half a day.

### Steps

1. File input → `loadImage()`
2. Square canvas with a **circular mask overlay** — a dark scrim with a transparent circle, since every platform crops avatars to a circle.
3. Pan by drag, zoom by pinch or slider. Track as `{ scale, offsetX, offsetY }` and apply as a canvas transform.
4. Clamp the transform so the image can never be dragged away from the crop area, leaving empty space.
5. Export **square**, 1080×1080, not circular. Platforms apply their own circular mask; a transparent-corner PNG will render with visible edges in places that composite it onto a background.
6. Download as JPEG unless the source had transparency.

### Touch handling

Use Pointer Events, not separate mouse and touch handlers. Pinch means tracking two pointers and the distance between them. Call `preventDefault` on the canvas so the browser doesn't zoom the whole page instead.

---

## Build order

Calculator → splitter → grid planner → fancy text → cropper.

The calculator has no dependencies and lets you finalise the page template. The splitter exercises every part of the shared layer, so build it second — anything wrong in `loadImage` surfaces there while you still have four tools to benefit from the fix.

## Interface copy rules

Active voice on every control. The button says what happens: **Split image**, not *Submit*. **Download 3 panels**, not *Export*.

Errors explain the fix, not the failure: *"This image is too small to split into 6 panels. Try 3, or use a wider image."* Not *"Invalid input."*

Empty states point at the next action: *"Add a photo to get started"* on a bare canvas.

## Definition of done, all five

- [ ] Works on a real iPhone and a real Android, not just devtools
- [ ] A 48MP photo processes without a blank canvas
- [ ] Zero network requests after page load — verify in the network tab
- [ ] Heavy libraries dynamic-imported, confirmed in the bundle analyzer
- [ ] Tool is reachable above the fold at 375px width
