# Brand guidelines: ishani.kathuria.net

The design system behind the portfolio. It describes what is built today, so when the site changes, change this file in the same commit.

Last reviewed: 29 Sep 2026 · Tokens live in [`index.css`](index.css) (`@theme`) · Components in [`components/`](components)

---

## 1. Essence

**One line:** a field guide printed on paper, with a machine reading over its shoulder.

The site is one idea repeated at every scale: **the human version and the machine version of the same facts, side by side.** Prose on paper on the left, the same content as JSON on a dark panel on the right. It fits the work (LLM agents, evals, tool-using systems) and it is already true of the site, which exposes a WebMCP tool layer and a Machine view.

| Personality | Means | Never |
|---|---|---|
| Specific | Real names, numbers, dates, links | Filler stats, "passionate about…" |
| Precise | Ruled lines, mono labels, tabular things | Decorative clutter, blur, glow |
| Playful, once | Sticker color and one small gesture per screen | Confetti, everything animated |
| Honest | Real numbers only; anything else is labeled *illustrative* | Invented metrics, fake testimonials |

**References:** a printed field guide, a dev-tools console, a sticker-covered laptop lid.
**Retired:** indigo `#3B5BDB`, Playfair Display, floating pill nav, glossy 3D buttons, `rounded-full` pills, blurred shadows, centered hero with floating badges.

---

## 2. Voice and copy

Write like a smart friend describing real work: concrete, brief, first person on the home page, neutral in UI.

**Rules**
- Sentence case everywhere, including buttons, headings, and labels. Proper nouns keep their capitals.
- Lead with the specific: *"Two years at AWS shipping LLM tooling"*, not *"Experienced engineer"*.
- Buttons are verb-first and short: *See the work*, *Download resume (PDF)*, *Copy lock-in command*.
- Errors say what happened, then what to do: *"Couldn't reach GitHub. … try again in a bit."* No "Oops", no raw exception text.
- Empty states invite: *"No repos match those filters."* + a clear action.
- No emoji in UI or copy. Icons are the outline set (Lucide) or none.
- Numbers keep their units and source: `2.5hr→30m`, `$50K/mo`, `>90%`. If a number is not in the data, it does not appear.

**Banned phrases:** unlock, elevate, seamless(ly), supercharge, revolutionize, harness the power, all-in-one, built for the modern…, say goodbye to…

**Machine voice** (mono, dark panels): lowercase keys, plain values, function-call labels.
`projects.list() → 4` · `get_project("autbot")` · `"status": "open_to_work"`.

**Availability line (canonical):** *Open to internships now and full-time from May 2027.*

---

## 3. Color

**One neutral ramp, one accent, and a sticker palette that stays decorative.**

### Core tokens

| Token | Hex | Role |
|---|---|---|
| `paper` | `#FBF8F3` | Page background |
| `paper-2` | `#F3EEE4` | Bands (hackathons, resume), quiet fills, code-free panels |
| `ink` | `#1C1A17` | Text, rules, borders, primary buttons |
| `ink-2` | `#5C564C` | Secondary text, mono labels |
| `rule` | `#D9D2C3` | Row separators (decorative) |
| `hi` | `#FFE45C` | **The accent.** Highlighter marks, active states, the one call to attention |
| `machine` | `#111111` | Dark "machine" panels, contact block |
| `machine-ink` | `#A8A8A8` | Body text on machine |
| `machine-dim` | `#8C8C8C` | Labels on machine |
| `agent` | `#FF4F00` | The agent cursor only |

### Sticker palette (decoration and category, never text color)

`yellow #FFD84D` · `mint #6EE7A0` · `purple #C4A3F5` · `lime #B8F04A` · `coral #FF9B8A` · `indigo #A5B4FC`

Used for: hero stickers, frame offset blocks, hackathon tiles, sticker badges. Always paired with `ink` text and a 1.5px `ink` border. Adjacent tiles never share a color.

### Contrast (measured, WCAG 2)

| Pair | Ratio | Use |
|---|---|---|
| ink on paper | 16.4:1 | Body |
| ink-2 on paper / paper-2 | 6.9:1 / 6.3:1 | Secondary text |
| ink on `hi` | 13.7:1 | Highlights, active nav |
| machine-ink on machine | 7.9:1 | Machine body |
| machine-dim on machine | 5.6:1 | Machine labels (minimum for small text) |
| ink on agent orange | 5.3:1 | Agent label |
| **white on agent orange** | **3.3:1, fails** | Do not use |
| ink on stickers | 8.2 to 12.9:1 | All six pass |
| rule on paper | 1.4:1 | Decorative only; never carries meaning |

**Rules**
- Text is `ink`, `ink-2`, or on-dark tokens. Nothing else.
- `hi` is the only chromatic accent for interaction. Sticker colors are content, not controls.
- Status never relies on color alone (dashboard status pairs a marker shape with a label).
- Light theme only, on every page including `/ir`.

---

## 4. Typography

| Role | Face | Notes |
|---|---|---|
| Display and headings | **Fraunces** 400 (500 and 600 also loaded) | Tight tracking (`-0.02em` to `-0.03em`), leading 0.95 to 1.1 |
| Text | **Inter** 400/500/600 | 15 to 18px, leading 1.6 to 1.7 |
| Machine, labels, data | **IBM Plex Mono** 400/500 | 12 to 13px; never below 12px |

Fonts load async with system fallbacks (Georgia / system-ui / ui-monospace).

### Scale (as built)

| Element | Size |
|---|---|
| Hero name | `clamp(52px, min(10.5vw, 15vh), 148px)`, sized to the viewport so the hero always fits |
| Detail page title | `clamp(38px, min(6.2vw, 9.5vh), 92px)` |
| Section H2 | 36px, 48px from `md` |
| Item titles (projects) | 30px, 38px from `md` |
| Hackathon tile titles | 30px; winner 38 to 46px |
| Stats numbers | 25px, 36px from `sm` |
| Body / long text | 15px (lists), 18px (about, case study) |
| Mono labels | 12 to 13px |

**Rules:** one display face per view; hierarchy comes from size and weight before boxes; line length 60 to 75ch; left-align body text; tabular numerals in data.

---

## 5. Layout, spacing, shape

- **Container:** max 1120px, gutters 20px (mobile) / 32px (`md`+).
- **Grid:** 12 columns. Section headers split 7 / 5 (title left, blurb and machine chip right).
- **Spacing unit:** 8px. Major sections `py-24`; tighter sections `py-20`; hero sizes itself to the viewport.
- **Rhythm:** sections must differ. Mix asymmetric splits, ruled lists, tiles, a dark full-bleed block. Never five identical cards.
- **Section pattern:** mono index `02 / Projects` → Fraunces H2 → one-line blurb → machine chip (`projects.list() → 4`).

### Shape and elevation

| Thing | Radius | Border | Shadow |
|---|---|---|---|
| Buttons, inputs | 3px | 1px ink | none |
| Toggle inner | 2px | none | none |
| Frames, images, machine panels | 4px | 1.5px ink | none |
| Stickers, tiles, browser frames | 6px | 1.5px ink | **hard**: `0 2px 0` (stickers), `0 4px 0` (tiles), 12px offset block (frames) |
| Row separators | none | 1px `rule` | none |
| Section rules | none | 1px `ink` | none |

**No blur shadows, no glassmorphism, no gradients** (except the hard-stop highlighter mark). Depth is a hard offset, never a glow.

---

## 6. Signature devices

These are what make the site recognizable. Reuse them; don't invent parallel ones.

1. **Human / machine twin.** Prose panel + dark JSON panel, same facts. Hero, project rows (JSON chip), detail hero (`get_project(id)`).
2. **The agent cursor.** Orange cursor labeled `agent` reads the hero once on load, highlighting each phrase and its JSON line. Stops the instant the visitor hovers or focuses anything; "replay" link afterwards; disabled under `prefers-reduced-motion`. **Only one autoplaying element exists on the site.**
3. **Highlighter mark.** `mark-hi`: a hard-edged yellow stroke behind the lower 40% of text. On dark, use a solid `hi` block with `ink` text.
4. **Stickers.** Flat, ink-outlined, slightly rotated, draggable in the hero. Six colors. Decorative, so `aria-hidden` when duplicating content.
5. **Ledger.** Real headline numbers in Fraunces over a small label, in ruled rows.
6. **Machine chip.** Dark mono pill in section headers giving the "tool call" that would return this section.
7. **Ruled rows.** 1px ink top rule, 1px `rule` separators; the default list style.
8. **Offset frame.** Browser-chrome frame with a colored block offset 12px down-right behind it. Product screenshots live here.

---

## 7. Components

**Buttons.** Primary: `ink` fill, `paper` text, 44px min height, hover → `hi` fill with ink text. Secondary: text link, mono 13px, underlined (`decoration-ink/30` → `ink` on hover), arrow `↗` for external. Emphasis on `/ir`: hard `0 3px 0` shadow that presses on `:active`.

**Chips (option pickers).** Mono 13px, 1px ink border, 3px radius, 44px tall; selected = `ink` fill; hover = `hi`. Always a `role="group"` with `aria-pressed`.

**Tiles (hackathons).** Sticker-palette fill, 1.5px ink border, 6px radius, `0 4px 0` ink shadow, `ink` text throughout. Winner spans two columns with its screenshot; organizer/winner shown as stickers.

**Browser frame (screenshots).** 32px mono URL bar on `paper-2`, screenshot beneath, offset color block behind. Projects without a live demo show their line illustration in the same frame.

**Diagrams.** SVG on `paper`, 1.2px ink strokes, active path 2.4px ink, active node filled `hi`, inactive `#B9B2A6`. Each has one control (chips, slider, or a button) and a dark log panel that narrates the current state (`aria-live="polite"`). On phones the SVG scrolls sideways inside its frame rather than shrinking text.

**Forms and filters.** 44px controls, 1px ink border, mono text, custom chevron (`appearance: none`), so heights match in every browser.

---

## 8. Imagery and graphics

**Product screenshots**
- Real, live products only, captured in a *populated* state (a simulation running, a classifier engaged), never an empty idle screen.
- 16:10, ≤1280px wide, JPEG q≈80, ≤~220KB each, in `public/img/`, lazy-loaded with `width`/`height` set and meaningful `alt`.
- If a demo renders badly (blank device mockups, error page), crop to the good part or use the illustration instead. Don't ship a broken shot.
- Screenshots are snapshots: recapture when the product changes.

**Illustrations** (`components/QuantumScene.tsx`). Ink line art with highlighter-yellow fills; no per-project colors. One per project/paper.

**Diagrams.** Explain the item's *real* mechanism from its own code or paper. Never reuse a diagram across items.

**Honesty rule.** A number appears only if it is in the item's data (`results` in `data.ts`). Everything else on a diagram is labeled *illustrative* in its caption.

**Social preview** (`public/ir/og.png`, 1200×630). Paper background, Fraunces name, three stickers, one yellow availability block, URL in mono.

**Favicon.** Serif "IK" in `paper` on `ink`, with a `hi` highlighter bar. SVG plus 32px and 180px PNG fallbacks.

---

## 9. Motion

- **One small gesture per screen.** The hero agent (once, ~7s) and the diagram controls are the motion.
- Nothing scroll-triggers. No fade-up on sections, no `scale` hovers.
- Hover and press: color change or a 2px shift, ≤150ms, ease-out.
- Diagrams change only when the visitor acts.
- `prefers-reduced-motion`: agent autoplay off, transitions effectively instant.

---

## 10. Accessibility (non-negotiable)

- Text contrast ≥ 4.5:1 (table above). Large/UI ≥ 3:1.
- Visible focus everywhere: 2px `ink` ring, `hi` on dark surfaces (`data-dark`).
- Touch targets ≥ 44px (`min-h-11`).
- Landmarks on every view (`header`, `nav`, `main`, `footer`), one `h1`, skip link on the home page.
- Decorative or duplicate content is `aria-hidden` (stickers, JSON twin panes). Real content never is.
- Chips are `aria-pressed` buttons; progress bars have names; dialogs close on Escape and move focus to the close button.
- **Check before shipping:** run axe (wcag2a, wcag2aa, best-practice) on the home page, one project, one paper, the dashboard, the Machine view, and `/ir`. All must be clean. Wait for the hero animation to finish first.
- Machine view (`Copy as Text`) must stay complete and current, since it is the fallback for agents without WebMCP.

---

## 11. Page-specific rules

### Home and detail pages
Follow §§3 to 10. Sections in order: Hero → Ledger → About → Projects → Hackathons → Research → Resume → Contact. Detail pages: hero twin → results strip (if the item has real numbers) → challenge → approach (interactive diagram / code) → impact → team → previous / next.

### Résumé links
`/resume.pdf` **always opens in a new tab** (`target="_blank" rel="noopener noreferrer"`), everywhere: hero, Résumé section, Machine view, `/ir`. In code, use `opensInNewTab()` from `components/Home.tsx`; it opens all `http(s)` and `.pdf` links in a new tab.

### Dashboard (`#dashboard`)
Ruled rows, not cards. Status = marker shape + label. Summary row is computed from live data. Empty/error states follow §2.

### `/ir` (career-fair landing page)
The path `/ir` is printed on QR codes and programmed into NFC tags. **It must never move or be renamed.**
- Standalone static file `public/ir/index.html`: no framework, inline CSS, async fonts, HTML ≤ ~5KB gzipped, so it paints instantly on congested cellular.
- Same tokens and devices as the site (paper/ink, Fraunces/Inter/Plex Mono, stickers, hard-shadow buttons, machine chip), single column, max 480px, light only.
- Must keep: LinkedIn, vCard (`/ir/ishani-kathuria.vcf`, with `download`), email, résumé (new tab), GitHub, GoatCounter script, JSON-LD, `og.png`, `apple-touch-icon.png`.
- Guarded by `npm run verify:ir` (runs on `predeploy`).
- Event copy ("Purdue Industrial Roundtable", the email subject) is time-bound: review it after the event.

---

## 12. Do / Don't

| Do | Don't |
|---|---|
| Show the real product, populated | Show empty states or broken embeds |
| Hierarchy through type size and weight | Wrap everything in cards |
| Vary section layout | Repeat one card grid |
| One accent (`hi`), stickers as decoration | Indigo/violet, gradients, glows |
| Hard offset shadows | Blur shadows, glassmorphism |
| Label illustrative data | Invent or round up numbers |
| Sentence case, specific copy | Title Case, filler phrases, emoji |
| 44px targets, visible focus | Hover-only affordances |
| One gesture per screen | Scroll-triggered fades, `scale-105` hovers |

---

## 13. Implementation map

| Concern | Where |
|---|---|
| Tokens, fonts, `mark-hi`, focus, reduced-motion | `index.css` (`@theme`). Tailwind v4 ignores `tailwind.config.ts`; put tokens here |
| Font loading | `index.html` (+ inline in `public/ir/index.html`) |
| Home page, hero twin, agent, tiles, rows | `components/Home.tsx` |
| Project / paper pages | `components/Detail.tsx` |
| Interactive diagrams (one per item) | `components/ProjectDiagrams.tsx` (`ItemDiagram`, keyed by item `id`) |
| Illustrations | `components/QuantumScene.tsx` |
| Stickers | `components/Sticker.tsx` |
| Dashboard | `components/Dashboard.tsx` |
| Machine view, routing, history, scroll restore | `App.tsx` |
| Content: items, results, images, code snippets | `data.ts`, `content.ts` |
| Screenshots | `public/img/` |
| `/ir` page, vCard, social image | `public/ir/` |
| Favicon set | `public/favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` |

### Adding a project or paper
1. Add it to `data.ts` (`projects` or `papers`) with narrative, `technical.codeSnippet` + `codeFile`, and `results` **only if** the numbers are real.
2. Add its diagram to `components/ProjectDiagrams.tsx` and its case in `ItemDiagram`.
3. Add an illustration in `QuantumScene.tsx` (fallback for the frame).
4. If it has a live demo: capture a populated 16:10 screenshot into `public/img/`, and add `image: { src, alt }`.
5. Check it at 375px and 1440px, run axe, then `npm run build`.

### Release checklist
`npx tsc --noEmit` → `npm run build` → `npm run verify:ir` → axe on the pages in §10 → test Back/scroll restore and browser Back → commit → push → `npm run deploy` → confirm the live bundle hash and `/ir`, `/resume.pdf` return 200.

---

## 14. Changing this system

Change tokens in `index.css` first, then components, then this file, in one commit. If a change touches `/ir`, also run `npm run verify:ir` and re-check the QR and NFC destination. If the accent or type changes, regenerate the social image and favicon.
