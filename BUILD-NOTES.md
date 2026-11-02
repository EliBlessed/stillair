# Stillair — Build Notes

## What Was Built
A two-page static-export Next.js 16.4.2 marketing demo website for **Stillair**, a fictional South Florida air-conditioning company (`output: "export"` in `next.config.ts`).

### Stack & Configuration
- **Framework**: Next.js `16.4.2` (App Router, static export to `out/`), React `19.3.0`, TypeScript `5.9.3` (strict), Tailwind CSS `4.3.3`, pnpm `12.9.1`.
- **Libraries**: `gsap` `3.15.0` (`ScrollTrigger`) and `lenis` `1.3.27`. Every dependency in `package.json` is pinned to an exact version (`-E`, no `^` or `~`).
- **Fonts**: `Geist` (UI/headings/body) and `Geist_Mono` (tabular numbers, temperature readouts, prices, phone numbers) self-hosted at build time via `next/font/google`.
- **Privacy & Honesty**: Zero analytics, tracking, cookies, external scripts, CDN links, API keys, or `.env` files. No invented statistics, star ratings, testimonials, years in business, certifications, guarantees, street addresses, or real HVAC manufacturer names.

### Pages & Features
1. **Home (`/`)**
   - **Floating Pill Header (`components/header.tsx`)**: Wordmark, navigation links (`Services`, `Tools`, `Plans`, `Commercial`), phone number, and `Book a visit` button. Collapses on mobile to wordmark, call icon button, and accessible menu toggle with `Escape` key support.
   - **Hero (`components/hero.tsx` + `components/scroll-scene.tsx`)**: Pinned `150vh` scroll-scrubbed scene with `"Demo concept · placeholder brand"` tag, live temperature readout counting `91°F → 72°F` in `Geist Mono`, heat-amber (`#E8892B`) tint fading to ice-blue (`#7CC8F2`), `"Cool. Finally."` `h1`, supporting line, and clickable CTA pills (`Book a visit`, `Call (305) 555-0142`). Supports `<canvas>` WebP frame sequences (`/media/hero/frame-0001.webp` and `/media/hero-phone/frame-0001.webp` under `768px`, loading frame 1 immediately with `fetchpriority="high"` and remaining frames after first scroll/tap), crossfading still image fallbacks (`/media/hero-hot.webp` and `/media/hero-cool.webp`), and CSS gradient fallbacks if images are missing. Under `prefers-reduced-motion: reduce`, pinning is disabled and the scene rests at the cool `72°F` state.
   - **Sound Familiar? (`components/symptoms.tsx`)**: Three tappable accordion cards (`It's blowing warm air`, `It's suddenly loud`, `My bill jumped`). Only one card opens at a time, smoothly expanding to show likely causes and what Stillair checks, paired with the five core services list.
   - **Every Part, Checked (`components/unit-scene.tsx`)**: Reuses `ScrollScene` (`200vh` pinned scroll) with `/media/unit/` frames (fallback `/media/unit-assembled.webp`) and slides in five outdoor condenser part labels one by one (`Fan and motor`, `Condenser coil`, `Compressor`, `Capacitor`, `Refrigerant lines` — no indoor filter label).
   - **Repair, Replace or Install? (`components/decision-tool.tsx`)**: Keyboard-accessible 3-tab interactive calculator:
     - *Repair*: Symptom selector displaying diagnostic (`$89–$150`) and common repair (`$150–$650`) ranges, plus compressor replacement (`$600–$2,500`) when relevant.
     - *Replace*: Interactive sliders for unit age (`1–25` years) and repair quote (`$100–$5,000`) applying the `$5,000 rule` (`age × repair cost > $5,000`), showing the live equation in small print as a common contractor rule of thumb alongside central replacement ranges (`2 ton`, `3 ton`, `4–5 ton`).
     - *Install*: Scenario picker (`New room or addition`, `Home with no AC`, `Upgrading to ductless`) showing matching mini-split or central ranges.
     - Prices roll smoothly (`components/roll.tsx`) and every outcome ends in a `Book a visit` button that prefills the booking form below.
   - **What Size Do I Need? (`components/size-picker.tsx`)**: Size chips (`6k`, `9k`, `12k`, `18–24k`, `Whole home`) that crossfade room photos, roll installed price ranges, and display the load-calculation footnote.
   - **Plans and Prices (`components/plans.tsx`)**: Three cards (`Tune-up`, highlighted `Comfort Plan` at `$219 / year` with raised surface and ice-blue border, and `Repair visit`), each prefilling the booking form.
   - **How It Works (`components/how-it-works.tsx`)**: Three-step sequence alongside `/media/technician.webp`.
   - **Booking Form (`components/booking.tsx` + `components/demo-form.tsx`)**: Client-validated form (`Name`, `Phone`, `ZIP code`, `What do you need?`, `Preferred day`, `Message`). Sends nothing; submitting displays the plain demo notice (`"This is a demo site, so no booking was made and nothing was sent."`) with a `"Back to the form"` button.
   - **Footer (`components/footer.tsx`)**: Demo concept badge, phone, email, page/service links, and `"Site design & build by Elijah"` with a `Contact` link (`target="_blank" rel="noopener"`).

2. **Commercial & Ducted (`/commercial`)**
   - **Hero**: `"Built for the whole building."`, supporting line for offices, shops, and restaurants, `Request a site survey` button, and `/media/commercial-rooftop.webp`.
   - **What We Handle**: Four cards (`Ducted system installs`, `Duct repair and sealing`, `Rooftop units`, `Vents and airflow balancing`) alongside `/media/commercial-ducts.webp`.
   - **Maintenance Contracts**: Highlighted card (`"Scheduled visits on your calendar, one point of contact"`, `"Quoted per site"`).
   - **Site Survey Form**: Validated demo form (`Business name`, `Contact name`, `Phone`, `Building type`, `Approx. square footage`, `Number of units`, `Message`) with the same demo thank-you panel.

## Files Created / Modified
- `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `.gitignore`
- `lib/site-data.ts` — single source of truth for all prices, sizes, plans, symptoms, parts, copy, and contact details
- `app/globals.css` — Tailwind v4 theme tokens, typography scale, pill buttons/chips, scroll-scene CSS math, reduced-motion rules, and overflow safeguards
- `app/layout.tsx` — root layout with self-hosted `Geist` and `Geist_Mono`, metadata, Open Graph tags, `Header`, `SmoothScroll`, and `Footer`
- `app/page.tsx` — Home page (`/`)
- `app/commercial/page.tsx` — Commercial & ducted page (`/commercial`)
- `app/icon.svg` — Ice-blue `"S"` mark on `#0A0F14`
- `app/robots.ts` — static `robots.txt` (allow all)
- `app/sitemap.ts` — static `sitemap.xml` (`/` and `/commercial`)
- `components/scroll-scene.tsx` — reusable GSAP `ScrollTrigger` pinned canvas/still/gradient scene
- `components/smooth-scroll.tsx` — Lenis smooth scrolling synced with GSAP `ScrollTrigger` and section entrance observer
- `components/header.tsx` — floating blurred pill header and mobile menu
- `components/footer.tsx` — footer with demo label and LinkedIn credit
- `components/hero.tsx` — Home hero section
- `components/symptoms.tsx` — `"Sound familiar?"` expandable symptom cards
- `components/unit-scene.tsx` — `"Every part, checked."` outdoor condenser scroll scene
- `components/decision-tool.tsx` — `"Repair, replace or install?"` interactive calculator
- `components/size-picker.tsx` — `"What size do I need?"` room size picker with photo crossfade
- `components/plans.tsx` — `"Plans and prices"` cards
- `components/how-it-works.tsx` — `"How it works"` 3-step section
- `components/booking.tsx` — Home booking section
- `components/demo-form.tsx` — shared client-validated demo form with prefill listener
- `components/roll.tsx` — animated number-roll component (`Roll` and `Money`)
- `components/book-link.tsx` — anchor link helper that dispatches form prefill events
- `components/img.tsx` — resilient `<img>` wrapper that hides broken image tags so CSS gradient frames show cleanly
- `public/media/` — generated WebP placeholder photographs (`hero-hot.webp`, `hero-cool.webp`, `unit-assembled.webp`, `technician.webp`, `calm-room.webp`, `commercial-rooftop.webp`, `commercial-ducts.webp`, `rooms/room-6k.webp`, `rooms/room-9k.webp`, `rooms/room-12k.webp`, `rooms/room-18k.webp`, `rooms/room-central.webp`, and `og.png`)

## Placeholders & Media Ready for Swap
- **Scroll-scrubbed frame sequences**: `frames.hero.count` and `frames.unit.count` in `lib/site-data.ts` are currently set to `0` so the site uses the high-resolution still placeholders (`/media/hero-hot.webp`, `/media/hero-cool.webp`, and `/media/unit-assembled.webp`) with smooth scroll crossfading. When real frame sequences are ready, drop `frame-0001.webp … frame-NNNN.webp` into `public/media/hero/`, `public/media/hero-phone/` (9:16 mobile set), and `public/media/unit/`, and update `count` in `lib/site-data.ts`.
- **Still photographs**: All 12 `.webp` photos and `og.png` in `public/media/` are custom-generated dark-moody placeholders ready to be replaced with final photography at the same paths.
- **Canonical domain**: `app/layout.tsx`, `app/robots.ts`, and `app/sitemap.ts` use `https://stillair.example` as the placeholder base URL; update to your Cloudflare Pages domain when deploying.

## Round 2

### Changes Built
1. **Hero Pull-Back Reveal, Stage Captions & Heat Shimmer (`components/hero.tsx`, `lib/site-data.ts`)**
   - **Desktop vs. Phone Composition**: On desktop (`>= 768px`), the temperature readout, stage caption, headline, supporting line, and CTA buttons sit on the left of the frame (`max-w-xl`). On phone (`< 768px`), the headline, supporting line, and buttons sit at the top of the frame above the unit, while the readout and stage caption anchor the bottom.
   - **Stage Captions**: Added `heroStages` in `lib/site-data.ts` rendered in `Geist Mono` directly under the temperature readout, updating with scroll: `91° "Heavy air."` → `84° "Breathing again."` → `72° "Cool. Finally."`.
   - **SVG Heat Shimmer**: Added `#hero-shimmer` (`<feTurbulence>` + `<feDisplacementMap>`) applied to the hero `h1` while the readout is above `84°`, with displacement strength following scroll and settling to `0` (`filter: none`) by `72°`. Disabled completely when `prefers-reduced-motion: reduce` is active.
   - Left `components/scroll-scene.tsx`, `components/smooth-scroll.tsx`, `next.config.ts`, and `package.json` untouched.
2. **"Feel the difference" Room Wipe Slider (`components/feel-difference.tsx`, `lib/site-data.ts`)**
   - Placed immediately after `"Sound familiar?"` on the home page.
   - Stacks `roomCompare.hot` and `roomCompare.cool` (pointing at `/media/hero-hot.webp` and `/media/hero-cool.webp` in `lib/site-data.ts` until `/media/room-hot.webp` and `/media/room-cool.webp` are supplied), both with `loading="lazy"`, `width={1376}`, and `height={768}`.
   - Starts on the hot side (`91°F`); dragging right wipes the cool room across and counts `91°F → 72°F` on the handle.
   - Built on a native `<input type="range">` with pointer capture so mouse drag, touch drag, and keyboard `ArrowLeft` / `ArrowRight` keys all move the wipe and update `aria-valuetext`. Respects `prefers-reduced-motion: reduce` (no easing).
3. **One Emphasised Ice-Blue Word per `h2`**
   - Updated every `h2` across `/` and `/commercial` so each has exactly one word in ice blue (`#7CC8F2` / `.text-ice`):
     - `Sound` **`familiar?`**
     - `Feel the` **`difference.`**
     - `Every part,` **`checked.`**
     - `Repair, replace or` **`install?`**
     - `What` **`size`** `do I need?`
     - `Built for` **`Florida.`**
     - `Plans and` **`prices`**
     - `How it` **`works`**
     - `Book a` **`visit`**
     - `What we` **`handle`** (`/commercial`)
     - `Maintenance` **`contracts`** (`/commercial`)
     - `Site` **`survey`** (`/commercial`)
4. **Stat Row + Call to Action (`components/stat-row.tsx`, `lib/site-data.ts`)**
   - Added `stats` in `lib/site-data.ts` (with DOE 10 CFR 430.32(c) and Florida residential load sources documented in comments) and rendered `StatRow` directly after `"What size do I need?"`:
     - `"3 tons"` — `"Typical size for a Florida home"`
     - `"14.3 SEER2"` — `"Federal minimum efficiency for new central AC in the Southeast since 2023"`
     - `"Jan 1, 2023"` — `"When the Southeast efficiency rule took effect"`
   - Repeated the two hero buttons (`Book a visit` and `Call (305) 555-0142`) underneath.
5. **One Idea per Screen (`md:min-h-[80svh]`) & Centred `"Sound familiar?"`**
   - Every section on the home page now has one focus, one clear action, and at least `min-h-[80svh]` on desktop.
   - Rebuilt `"Sound familiar?"` (`components/symptoms.tsx`) into a single centred column (`mx-auto max-w-2xl`) on desktop with a single `"Book a diagnostic visit"` action below the accordion cards.
6. **Phone Tab Wrapping Fix (`components/decision-tool.tsx`, `app/globals.css`)**
   - Added `whitespace-nowrap` and compact mobile padding (`px-3 text-sm sm:px-8 sm:text-base`) on the `"Repair, replace or install?"` tabs and `.chip` so `Repair`, `Replace`, and `Install` stay on a single line at `390px` and `360px` without breaking mid-word.

### What Was Checked in the Browser (`360px`, `390px`, `1440px`)
- Ran `pnpm build` and `pnpm lint` (0 errors, 0 warnings), served `out/` locally, and verified in headless Chrome via CDP:
  - **Slider interaction**: Dragging with the mouse moves the wipe and updates the handle readout (`91°F` → `78°F`); pressing `ArrowRight` / `ArrowLeft` moves it step-by-step (`78°F` → `77°F`).
  - **Tabs on one line**: At both `390px` and `360px`, `Repair`, `Replace`, and `Install` share the exact same `top` coordinate, `44px` height, and `white-space: nowrap`.
  - **`h2` blue word check**: Every `h2` on `/` (9 headings) and `/commercial` (3 headings) has `blueCount === 1`, `singleWord === true`, and computed color `rgb(124, 200, 242)` (`#7CC8F2`).
  - **Hero scroll & reduced motion**: Confirmed stage captions transition `91° Heavy air.` → `84° Breathing again.` → `72° Cool. Finally.`, SVG displacement scales from `3.50` at `91°` to `0` (`filter: none`) at `72°`, and `prefers-reduced-motion: reduce` rests at `72° Cool. Finally.` with `filter: none`.
  - **No horizontal scroll**: `document.documentElement.scrollWidth === window.innerWidth` at `1440px`, `390px`, and `360px`.
  - **Zero console errors**: `0` console errors, `0` uncaught exceptions, and `0` failed network requests across `/` and `/commercial`.



## Claude fixes on top of round 2 (2026-11-02)
- Phone speed (Lighthouse 13.5, home): 76 → 92–96 (median 94); commercial 89 → 96–97; desktop 99.
  - gsap and Lenis load after hydration (dynamic import), not in the first HTML.
  - Heat shimmer starts on the first scroll: a filtered h1 counted as a late repaint (LCP ~3.4 s).
  - Only the first hero still is fetched eagerly; others are `loading="lazy"` (React preloads every eager img).
  - 800px phone copies: `hero-hot-800.webp`, `commercial-rooftop-800.webp` (via srcSet). Keep a `-800` copy beside the first hero still.
  - Geist Mono isn't preloaded (numbers swap in).
  - Commercial first screen uses a CSS-only entrance (`.rise`) instead of the JS reveal, so it paints before JavaScript.
- Customer tests: `pnpm build && pnpm test:e2e` (`tests/e2e/site.spec.ts`, 14 checks × desktop, laptop, tablet, phone, iPhone). `tests/serve.mjs` serves out/ with clean URLs like Cloudflare (`pnpm preview`).
