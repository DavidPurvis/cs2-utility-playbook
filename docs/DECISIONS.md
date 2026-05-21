# Architecture Decision Records — Dust 2 Playbook

One consolidated file for the 5 most load-bearing decisions. Each entry: decision, alternatives considered, why, trigger to revisit.

| # | Decision | Status |
|---|---|---|
| ADR-001 | React 18 + Vite + TypeScript strict | ACTIVE |
| ADR-002 | JSON data file (not Markdown frontmatter) | ACTIVE |
| ADR-003 | GitHub Pages (not Proxmox / Vercel / Netlify) | ACTIVE |
| ADR-004 | No router library — state-driven navigation | ACTIVE |
| ADR-005 | Co-located screenshots in `public/screenshots/` | ACTIVE |

---

## ADR-001 · React 18 + Vite + TypeScript strict

**Alternatives considered:** Astro static site generator, vanilla TypeScript, SolidJS, Lit, htmx, plain HTML.

**Why React + Vite + TS strict:**
- The toolchain is already wired and the test pyramid (Vitest + Testing Library + tsc strict) already passes against the coord math, parse-setpos, and bounds utilities. Swapping frameworks throws all of that away.
- Vite is esbuild under the hood + HMR. Picking a different bundler buys nothing.
- TS strict is pulling weight on the coordinate types (branded `WorldPoint` vs `PercentPoint` vs `PixelPoint` distinctions in `coordinates.ts`).
- ~15 components total — too small to justify framework optimization.

**Trigger to revisit:** if the app grows to multi-map AND the owner wants build-time markdown authoring, Astro becomes attractive.

---

## ADR-002 · JSON data, not Markdown frontmatter

**Alternatives considered:** Markdown-with-frontmatter (one .md per lineup or scenario), YAML, SQLite + a tiny query layer, build-time SSG output from any of the above.

**Why JSON:**
- Single author. The Markdown advantage (diff-readable file-per-entity in PRs) evaporates when nobody else is reviewing the PR.
- The boot validator `assertDustData` is one function. YAML / Markdown require a parser dependency and a build step.
- `JSON.stringify(data, null, 2)` is a one-liner. The two CLIs append entries in 5 lines each.

**Trigger to revisit:** if scenarios grow past ~30 (file-per-scenario gets cleaner) OR a second author joins.

---

## ADR-003 · GitHub Pages, not Proxmox

**Alternatives considered:** Vercel, Netlify, Cloudflare Pages, Proxmox + nginx, Proxmox + Caddy.

**Why GitHub Pages:**
- $0, free TLS, CDN edges, zero ops, atomic deploy on `git push main` via the existing workflow.
- Proxmox self-hosting is doable but introduces uptime / TLS-renew / DNS chores for no benefit on a read-only static SPA. Friend trying to load the site from a different network shouldn't hit a home connection.
- The other CDN platforms (Vercel/Netlify/Cloudflare) are no easier than Pages — and they introduce a vendor.

**Trigger to revisit:** if the app ever needs server-mediated features:
- Auth on private scenarios.
- A write API (in-app screenshot upload, in-app lineup editor that bypasses git).
- Real-time sync clock for multi-player coordination.
- Analytics that can't be public.

If any of those become real, migrate `dist/` onto Proxmox + Caddy. The app code stays identical; the deploy story changes.

---

## ADR-004 · No router library — state-driven navigation

**Alternatives considered:** react-router (~10 KB), wouter (~2 KB), TanStack Router (~5 KB), custom hash routing.

**Why no router:**
- Three views (home, scenario, lineup) — too few to justify a routing dep.
- URL-share is not a v6 requirement (no "send me scenario 4 directly" use case stated).
- A `useReducer` + a `popstate` listener handles back-button parity at ~50 LOC, lower than any library wrapper.

**Trigger to revisit:** if URL sharing becomes a stated need (deep-link to scenario 4 → A-man → step 2 → walkthrough), add `wouter` (~2 KB) and route those paths.

---

## ADR-005 · Co-located screenshots in `public/screenshots/`

**Alternatives considered:** hot-link to cs2util.com (status quo from v5), upload to Cloudflare R2 / S3 / similar, embed as base64 in JSON.

**Why local files:**
- Mid-match call risk: cs2util.com CDN drops a URL and every walkthrough showing that lineup breaks. For a coordination tool, that's catastrophic.
- The webp files are tiny (30 KB - 700 KB each, 30 total in v6 ≈ 6 MB). Bundle bloat is negligible vs. the reliability win.
- Single-author site — no need for CDN multi-region edge serving.
- Vite's static asset handling picks them up automatically; no extra tooling.

**Trigger to revisit:** if the screenshot set grows past ~200 files (60-100 MB), move to R2 / a CDN and reference by URL — at that scale the bundle is noticeable on cold cache.
