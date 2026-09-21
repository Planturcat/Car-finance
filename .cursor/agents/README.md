# Website Builder — Developer Guide

Short guide for building client marketing sites from this Next.js scaffold using the **website-builder** Cursor subagent.

## What this repo is

A reusable marketing-site scaffold (Next.js 14 App Router) with pre-built page sections, UI primitives, and global layout. Each new client project starts here: clean up demo content, swap branding, then compose or adapt sections.

**Stack:** Next.js 14 · TypeScript · Tailwind CSS · Framer Motion · Radix UI

## Quick start

```bash
pnpm install
pnpm dev
# → http://localhost:3000
```

Set env vars in `.env.local`:

```env
NEXT_PUBLIC_APP_NAME="Client Name"
NEXT_PUBLIC_APP_DOMAIN="clientdomain.com"
NEXT_PUBLIC_APP_URL="https://clientdomain.com"
```

## Using the subagent

In Cursor chat, invoke the agent by name:

```
Use the website-builder subagent to build a site for [Company] — [industry], needs [sections]
```

Other useful prompts:

```
Use website-builder to clean up the scaffold and rebrand for Tattoo Hub
Use website-builder to brainstorm sections for a tattoo studio
Use website-builder to add a services section matching our design language
```

The full agent spec lives in [`website-builder.md`](./website-builder.md).

## Workflow (8 steps)

| Step | What happens |
|------|----------------|
| 1. **Orient** | Agent reads repo structure, sections, constants, styles, SEO files |
| 2. **Clarify** | Company name, audience, goals, sections, assets, **live URL**, OG card |
| 3. **Cleanup** | Phase 0 — strip demo branding, replace fonts/icons/images/videos |
| 4. **SEO** | Phase 0.11 — robots, sitemap, manifest, JSON-LD, landscape OG, `docs/SEO_SETUP.md` |
| 5. **Plan** | Section map: reuse vs. new builds |
| 6. **Build** | Implement sections, wire page + nav |
| 7. **Verify** | Design checklist + SEO checklist + lint |
| 8. **Summarize** | Files changed, TODOs, env vars, sitemap routes, OG path |

Always do **cleanup before building**. Do not layer client content on top of Dev Shack / Luro demo copy. Ship **SEO with every new client site** — never leave square logos as `og:image`.

## Phase 0: Scaffold cleanup

When starting a new client, replace demo identity first:

| Asset | Where |
|-------|--------|
| Env & metadata | `.env.local`, `src/functions/metadata.ts`, `src/constants/site.ts` |
| Fonts | `public/fonts/` → `src/constants/fonts.ts` → `tailwind.config.ts` |
| Logos & favicons | `public/icons/` or `public/brand/`, `src/components/global/icons.tsx` |
| Photos | `public/images/`, paths in `src/components/marketing/*.tsx` |
| Videos | `public/*.mp4`, refs in hero / mission / academy sections |
| Copy & links | `src/constants/`, footer, nav `menuItems` in `layout.tsx` |
| SEO kit | `src/app/robots.ts`, `src/app/sitemap.ts`, `public/manifest.webmanifest`, JSON-LD in layout, `public/brand/og.jpg` (1200×630), `docs/SEO_SETUP.md` |

Grep for leftovers: `Dev Shack`, `DevShack`, `Luro`, `dev-shack`.

### Social / OG cards

X shows a gray placeholder when `og:image` is a **square favicon**. Always ship a **1200×630** landscape card and set honest width/height in metadata. Details: §0.11 in [`website-builder.md`](./website-builder.md).

## Design language

Every section must follow a **clean, flat, editorial** style:

- **Clean** — generous whitespace, clear type hierarchy
- **Flat** — no card grids, heavy shadows, or nested bordered boxes
- **Smooth** — `Container` stagger animations, `transition-colors duration-300` on hovers
- **Minimal gradients** — solid headlines, flat `bg-background`; gradients only on image overlays

**Reference sections** (copy these patterns):

- `src/components/marketing/mission-statement.tsx`
- `src/components/marketing/for-businesses.tsx`
- `src/components/marketing/quote-section.tsx`
- `src/app/(marketing)/layout.tsx` (nav)

**Avoid** (old demo patterns — strip when reusing):

- `MagicCard`, `bento-card`, `SectionBadge` grids (`features.tsx`)
- Gradient headline classes (`.heading`, `bg-clip-text`)
- Radial backgrounds, `Particles`, heavy box shadows

## Key folders

```
src/
├── app/(marketing)/     # Page composition (page.tsx, layout.tsx)
├── components/
│   ├── marketing/       # Page sections (Hero, MissionStatement, …)
│   ├── global/          # Container, Icons, Images, Background
│   └── ui/              # Button, BlurText, Carousel, etc.
├── constants/           # Site config, fonts, links, perks, reviews
├── functions/           # cn(), generateMetadata()
└── styles/globals.css   # CSS variables, theme tokens
```

## Adding a section

1. Create `src/components/marketing/my-section.tsx`
2. Export from `src/components/index.ts`
3. Import in `src/app/(marketing)/page.tsx`
4. Add nav anchor in `layout.tsx` if the section has an `id`
5. Put repeatable data in `src/constants/`

Use `'use client'` when the section uses Framer Motion or hooks.

## Checklist before shipping

- [ ] Demo branding removed (grep clean)
- [ ] Client fonts, icons, images, videos in place
- [ ] Sections follow flat editorial design (no card chrome)
- [ ] Nav links match section `id`s
- [ ] Metadata / OG image updated
- [ ] `pnpm lint` passes

## Further reading

- Full subagent instructions: [`website-builder.md`](./website-builder.md)
- Project README: [`../../README.md`](../../README.md)
