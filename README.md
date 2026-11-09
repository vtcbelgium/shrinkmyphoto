# ShrinkMyPhoto

[![Live Site](https://img.shields.io/badge/Live_Tool-shrinkmyphoto.othrys.be-0284c7?style=flat-square)](https://shrinkmyphoto.othrys.be)
[![Privacy](https://img.shields.io/badge/Privacy-100%25_Client--Side-16a34a?style=flat-square)](https://shrinkmyphoto.othrys.be)
[![Cookies](https://img.shields.io/badge/Cookies-0-blue?style=flat-square)](https://shrinkmyphoto.othrys.be)
[![WCAG AA](https://img.shields.io/badge/Accessibility-WCAG_AA-blueviolet?style=flat-square)](https://shrinkmyphoto.othrys.be)

> Fast, private, client-side on-device photo compressor to exact 20KB, 50KB or 100KB limits. Runs 100% in your browser with zero server uploads, zero cookies, and zero tracking.

## Features
- **100% Client-Side:** Files and confidential data never leave your device.
- **Zero Cookies & Zero Trackers:** Closed-valve privacy architecture with 0 third-party telemetry scripts.
- **Keyboard Spotlight:** Jump to any of the 20 sovereign tools anytime by pressing <kbd>⌘K</kbd> or <kbd>Ctrl+K</kbd>.
- **PWA Ready:** Works offline on laptops, MacBooks, tablets, and mobile devices.

## Direct Web Access
Use the live tool instantly without installing anything:
[https://shrinkmyphoto.othrys.be](https://shrinkmyphoto.othrys.be)


# ShrinkMyPhoto

A standalone, privacy-first image compressor built with Vite, vanilla TypeScript, semantic HTML and responsive CSS. No runtime dependencies, accounts, paid services or backend.

## Run locally

Requires Node.js 22.12+ (tested with Node 24) and npm.

```sh
npm ci
npm run dev
npm run typecheck
npm test
npm run build
```

On PowerShell installations that block npm.ps1, use `npm.cmd` instead. Production files are generated in `dist/`. Nothing in this repository deploys them.

## Privacy

Image bytes stay on the device. The app uses `createImageBitmap`, canvas and `toBlob`; it never uploads an image or calls a compression service. It has no analytics, tracking, cookies, local storage, remote fonts, remote images, authentication or external runtime requests. The hosting provider still sees ordinary page requests and may log IP addresses. Downloaded files are controlled by the browser and user.

Blob URLs are revoked on replacement, removal and page exit. Decoded bitmaps are closed and temporary canvases are cleared. Reloading loses the working image. Canvas re-encoding normally drops EXIF/GPS metadata, but the app is not a forensic metadata sanitizer. A strict same-origin CSP is included; its localhost WebSocket allowance supports Vite development. For a future production host, use an HTTP CSP header with `connect-src 'none'` and `frame-ancestors 'none'` after testing.

## Compression behavior and limits

- One JPEG, PNG or WebP still image at a time. File signatures are inspected rather than trusting MIME types or extensions. APNG and animated WebP are rejected; GIF, HEIC and SVG are unsupported.
- Maximum input: 20,000,000 bytes, 24,000,000 pixels, and 16,384 pixels per edge. Headers are checked before decoding and decoded dimensions checked again. Corrupt files may pass header inspection but fail browser decoding. Smaller device-specific memory/canvas limits may still cause an error.
- Modern browsers apply EXIF orientation through `createImageBitmap({ imageOrientation: 'from-image' })`. Preview orientation and colors before saving; codec, color management and memory behavior vary by browser. Unsupported decoding or output formats produce errors. PNG fallback from an unsupported canvas encoder is rejected explicitly.
- Default output is the source format. PNG and WebP retain alpha. Converting either to JPEG requires explicit consent to flatten onto white, even if the particular file has no transparent pixels.
- Decimal sizes: 1 KB = 1,000 bytes. Targets are whole numbers from 1 to 20,000 KB. The optional longest-edge cap never upscales.
- JPEG/WebP try quality 0.94, then 0.18 and seven bounded bisection attempts when feasible. If neither endpoint fits, dimensions shrink adaptively. PNG adjusts dimensions only; its encoding is lossless, resizing is not.
- Search is limited to eight dimension passes, with at most 72 encodes. It favors the largest attempted dimensions that fit, then higher quality. It does not prove a global optimum or guarantee exact size. If no candidate fits, the smallest tested candidate is offered with an explicit target-not-met message. The result can be larger than the original; that is also labeled.
- Processing controls are locked while a job runs to prevent overlapping decodes/encodes. Browser-native encoding is asynchronous but rendering large canvases can briefly occupy the main thread. There is no cancel button; close or reload the page to abandon work.

## Accessibility and SEO

Keyboard-accessible file input, native labels and form validation, visible focus, status announcements, an alert region, reduced-motion support, responsive layout and meaningful preview alternatives. The selected filename is rendered as text, never HTML.

Unique title, description and OpenGraph text are provided. `noindex, nofollow` intentionally remains set until a real domain is chosen. There is no fabricated canonical URL, OpenGraph URL or hosted image. Before a future launch, choose the real domain, then review indexing and add truthful canonical/social URLs.

## QA

Automated unit tests cover decimal targets, size formatting, fit/no-upscale behavior, transparency consent, truthful size reporting, dimension limits, JPEG/PNG/WebP headers, animation rejection, bounded search, quality selection, resizing and encoder failures.

`scripts/browser-smoke.js` is a repeatable browser smoke expression: open the local app, run the entire file in DevTools or an automation evaluator, and await its result. It generates fixtures entirely in memory and checks the real UI, all three codecs, alpha pixels, JPEG consent/white pixels, output bytes, resize, corrupt-file errors, URL cleanup and viewport overflow. It changes the current working image; use a fresh page. Chromium smoke passed all 16 assertions at a 360 px viewport during implementation. Safari, Firefox, real mobile hardware and EXIF fixture checks remain manual QA items.

Manual browser checklist:

- Upload and drop JPEG, PNG with alpha, opaque PNG, and WebP. Confirm dimensions, bytes, before/after previews and downloaded extension/content.
- Test 100/200/500 KB presets, custom targets, each resize cap and each output format. Verify actual downloaded byte count against the displayed target result.
- Confirm PNG/WebP → JPEG requires white-background consent and produces white pixels where transparent. PNG/WebP output should keep alpha.
- Use an EXIF-rotated JPEG and compare source/output orientation. Check current Chrome/Edge, Firefox and Safari, plus iOS/Android.
- Test corrupt and empty files, unsupported types, APNG/animated WebP, inputs over limits and impossible targets. Confirm errors are meaningful and no false success is shown.
- Replace/remove an image repeatedly. Ensure stale results disappear after settings change and no previous download remains available.
- Use keyboard only and a screen reader; inspect narrow 320–390 px layouts, zoom to 200%, and reduced-motion mode. Confirm no horizontal overflow.
- Inspect the Network panel while selecting, compressing and downloading: no photo requests should occur. Test the built page offline after loading its assets.

No deployment, new remote repository, or changes to other sites are needed.
