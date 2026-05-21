# CS2 Utility Playbook — Project Context

**Living requirements & decisions log.** Update this file whenever the owner makes a new ask, changes direction, or we ship a decision that affects architecture, data, or quality bars.

| Field | Value |
|-------|--------|
| **Last updated** | 2026-05-20 (production pass) |
| **Maintainers** | David Purvis + agents/contributors |
| **Related docs** | [README.md](./README.md) (usage), [tests/fixtures/stability-baseline.json](./tests/fixtures/stability-baseline.json) (regression numbers) |

---

## How to use this file

1. **New user ask** → Add a row under [Requirements log](#requirements-log) with date, request, status, and acceptance criteria.
2. **Decision made** → Add an entry under [Engineering decisions](#engineering-decisions) with rationale and alternatives considered.
3. **Vision shift** → Edit [Product vision](#product-vision) in place; note what changed in the changelog.
4. **Shipped work** → Mark requirement `Done` and link to PR/commit or files touched.
5. **Agents** → Read this file at the start of a task; append updates before finishing unless the user asked for a read-only answer.

---

## Product vision

### What we are building

A **team-first CS2 utility playbook**: a fast, mobile-friendly web app that helps amateur squads (roughly Silver–DMG) learn and run coordinated utility without digging through spreadsheets or random YouTube tabs.

### Who it is for

- Players with limited practice time (9-to-5 schedules) who need **memorable, repeatable lineups**.
- Teams that want **shared vocabulary** (combos, belts, scenarios) and **personalized study sheets** per player.
- Coaches/captains who want one place to say “everyone learn these five smokes on Ancient.”

### What success looks like

| Dimension | Target |
|-----------|--------|
| **In-match** | Open app → pick map/side → find the right smoke/flash in seconds |
| **Pre-match** | Study mode + Must Learn 5 give a focused pre-queue checklist |
| **Team** | Roster names, belts, and combos reflect real 5-stack roles |
| **Data trust** | Structural validation passes in CI; lineups reviewed for in-game accuracy over time |
| **Stability** | Quantifiable test/metrics score; regressions caught before deploy |

### Non-goals (for now)

- Replacing Refrag/cs2util as the primary practice environment (we **link out** to them in Training).
- Pro-level strat authoring or demo parsing.
- Real-time sync / accounts / cloud roster (localStorage only today).
- Native mobile app or Steam overlay (web/PWA deferred).

### Experience pillars

1. **Playbook** — Must Learn, combos, belts, scenarios, searchable lineup reference.
2. **Map** — Radar with setup positions and spawn instant-utility flows.
3. **Study** — Distraction-free Must Learn sheet; shareable via `?p=`.
4. **Training** — Warmup + session list with one-click launch links.

---

## Requirements log

Status: `Open` | `In progress` | `Done` | `Deferred` | `Won't do`

| ID | Date | Request (owner ask) | Status | Acceptance criteria | Notes / links |
|----|------|---------------------|--------|---------------------|---------------|
| R-001 | 2026-05 (audit) | Implement **audit & remediation plan** (metadata, CI, data consistency, Cache, partial refactor, initial tests) | **Done** | CI green; validator enforced; Cache in selector; dead code removed; mustLearn↔MUST_LEARN fixed on Anubis/Mirage/Inferno | Plan file was read-only; todos completed |
| R-002 | 2026-05 | **Comprehensive automated testing** — unit, UI, regression, quantifiable stability | **Done** | 129 tests; `test:metrics` JSON; baseline fixture; layered scripts (`test:unit`, `test:ui`, `test:regression`) | See [tests/](./tests/), `scripts/stability-report.mjs` |
| R-003 | 2026-05 | **Living project context** — track asks, decisions, vision; update each new request | **Done** | This file exists; README points here; maintenance rules documented | |
| R-012 | 2026-05-20 | **Production ready** — deploy, lint gate, lazy maps, PWA shell, validate pipeline | **Done** | `npm run validate` green; GitHub Pages deploy workflow; v1.0.0; ESLint in CI | See README Production section |
| R-013 | 2026-05-20 | **Reconcile dual code audits** — apply valid findings, skip stale ones | **Done** | See audit reconciliation below; 141 tests; `npm run validate` green | |
| R-015 | 2026-05-20 | **Fix map overlay coordinate scaling** with canonical CS2 conversion + hybrid point schema | **Done** | World-to-percent formula implemented; map metadata added; lineup + landmark conversion tests added; render pipeline uses shared resolver | `data/radarMetadata.js`, `lib/mapCoordinates.js`, `tests/map-coordinates.test.js`, `tests/lineup-positions.test.js` |
| R-004 | — | **Curated YouTube URLs** for Premier lineups (replace search fallbacks) | **Open** | Validator warnings for `youtube.com/results` trend toward zero on Premier maps | ~148 warnings today; use `data/youtube.js` `yt()` pattern |
| R-005 | — | **Screenshot URLs** filled for lineups (stand/aim/result) | **Open** | Empty-screenshot warnings reduced; Practice mode shows images | Cache map especially incomplete |
| R-006 | — | **Manual in-game accuracy review** per Premier map | **Open** | Documented review notes or source upgrades where lineups drift | Cross-check Refrag / cs2util / match replay |
| R-007 | — | **Full App.jsx decomposition** into feature components | **Deferred** | App.jsx slim; playbook/map/study modules separated | Partial extract done (`lib/`, `components/`, `context/`) |
| R-008 | 2026-05-20 | **ESLint** + stricter React/data lint rules | **Done** | `npm run lint` in CI and `validate` | `eslint.config.js` |
| R-009 | 2026-05-20 | **PWA / installable shell** (manifest) | **Partial** | `manifest.json` + icons on GH Pages base path | Service worker / offline still deferred |
| R-010 | 2026-05-20 | **Print-friendly study sheet** | **Done** | `@media print` hides controls; study sheet prints cleanly | `index.html` + `.no-print` on study actions |
| R-011 | — | **Playwright (or similar) E2E** in real browser | **Deferred** | Optional second layer beyond jsdom UI tests | jsdom coverage deemed sufficient for now |

*Add new rows at the bottom with the next ID (R-012, …).*

---

## Engineering decisions

Decisions are **intentional** unless marked *Tentative*. Revisit when requirements change.

### Architecture & code organization

| Decision | Rationale | Alternatives considered |
|----------|-----------|-------------------------|
| **Vite + React 18 SPA** | Fast dev, simple deploy to GitHub Pages | Next.js (overkill), plain HTML (harder at this data size) |
| **Map data as ES modules** (`data/*.js`) | No backend; easy edit; validators run in Node tests | JSON/YAML (worse ergonomics for comments), CMS |
| **`data/maps.js` registry** with `PREMIER_MAP_IDS`, `BONUS_MAP_IDS`, `WIP_MAP_IDS` | Clear selector vs validation scope | Single flat list (lost WIP/bonus semantics) |
| **Partial refactor** — `lib/theme.js`, `lib/youtube.js`, `context/MapDataContext.jsx`, `components/*` | Reduce App.jsx risk without big-bang rewrite | Full component split in one PR (deferred, R-007) |
| **Root `ErrorBoundary`** in `main.jsx` | Isolate render failures | Per-section boundaries only |

### Data model & validation

| Decision | Rationale | Alternatives considered |
|----------|-----------|-------------------------|
| **`tests/validateMapData.js`** as single validator | Same rules for tests, benchmarks, and metrics | Per-map ad hoc tests only |
| **Premier rules**: `MUST_LEARN.length === 5`, bidirectional `mustLearn`, required `SPAWNS` + `RADAR_URL` | Consistent “core 5” product promise | Variable must-learn count per map |
| **Hybrid radar coords**: support `{x,y}` and `{worldX,worldY}` | Backward compatible with existing data while enabling canonical CS2 world projection | Percent-only forever |
| **Belt `step.carrier`** for grenade cap + smoke limits | Matches CS2 loadout reality | Global sequence cap only |
| **Warnings vs errors** | Search URLs / empty screenshots warn; structural issues error | Treat all warnings as CI failures (too noisy today) |
| **`data/youtube.js`** — `ytSearch()` + `isYoutubeSearchUrl()` | Shared helper; migration path to curated URLs | Inline URLs only |

### UI / UX

| Decision | Rationale | Alternatives considered |
|----------|-----------|-------------------------|
| **Two top-level sections**: Maps \| Training | Matches mental model: in-game vs out-of-game | Single scrollable page |
| **Cache in selector** as **bonus** map | Content complete enough to ship; screenshots still WIP | Hide until 100% media (rejected after R-001) |
| **Deep links**: `?map=`, `?lineup=`, `?p=` | Shareable map/study/practice entry | Hash-only routing |
| **Lineup search** in expanded “All lineups” panel | Avoid cluttering main playbook | Global search bar always visible |
| **localStorage** for map + roster | No auth infrastructure | Cloud sync (non-goal) |
| **`loadMapModule()`** lazy imports | Smaller initial JS; per-map chunks in prod | Eager `maps-registry.js` for tests only |
| **`npm run validate`** | Single release gate: lint + test + build + dist verify | Ad hoc commands only |
| **GitHub Pages deploy workflow** | Auto-publish on main/master after validate | Manual upload |

### Testing & quality

| Decision | Rationale | Alternatives considered |
|----------|-----------|-------------------------|
| **Vitest** + Testing Library + **jsdom** for UI | Fits Vite stack; fast CI | Jest, Playwright-only (R-011 deferred) |
| **129-test pyramid**: unit → data → regression → UI | Quantifiable coverage of rules and flows | Data-only tests (insufficient for UI regressions) |
| **`stability-baseline.json`** + **frozen per-map counts** | Detect accidental lineup deletion | Loose “> N lineups” only |
| **`buildStabilityReport()`** weighted scores | Single number for health trends | Pass/fail tests only |
| **CI**: `npm test` + `npm run test:metrics` + `npm run build` on Node 20/22 | Metrics visible in logs; matrix catches version issues | Metrics only locally |
| **Vitest `pool: forks`** | Avoid Node 24 worker bootstrap stack overflow | worker_threads pool |
| **Global RTL `cleanup()`** in `tests/setup.js` | StrictMode double-mount without duplicate queries | Disable StrictMode in tests |

### Deploy & ops

| Decision | Rationale | Alternatives considered |
|----------|-----------|-------------------------|
| **`base: '/cs2-utility-playbook/'`** in Vite | GitHub Pages project site | Root domain path |
| **GitHub Actions** on push/PR to main/master | Free CI for fork contributors | No CI (rejected in R-001) |
| **Title**: “CS2 Utility Playbook” | Matches product name | Legacy “ancient playbook” naming |

---

## Current system snapshot

*Refresh when major milestones land.*

| Metric | Value (2026-05-20) |
|--------|----------------------|
| Maps in registry | 8 (7 Premier + Cache bonus) |
| Total lineups | 148 |
| Validation errors | 0 |
| Validation warnings | 152 (mostly YouTube search + empty screenshots) |
| Tests | 221 passing (see `npm test`) |
| Stability overall score | ~86/100 (`npm run test:metrics`) |
| Release version | 1.0.0 |
| Deploy | GitHub Actions → Pages (`deploy.yml`) |
| `App.jsx` size | Still large (~1.5k+ lines); further split deferred |

---

## Backlog aligned to vision

Priority is **owner-driven**; default order below reflects impact on trust and daily use.

1. **Media quality** (R-004, R-005) — curated videos + screenshots → better Practice mode and higher `mediaQuality` score.
2. **Accuracy pass** (R-006) — human verification per map; update `source` / notes when lineups patch.
3. **App structure** (R-007) — easier contributions and UI test targeting.
4. **Developer ergonomics** (R-008) — lint in CI.
5. **Reach** (R-009–R-011) — PWA, print sheet, optional E2E.

---

## Audit reconciliation (2026-05-20)

Two audits were compared against the current tree. **Stale** findings (already fixed before this pass) were not re-applied:

| Original finding | Verdict |
|------------------|---------|
| Cache 0–1 coords, string `source`, boolean `austincs`, empty stubs | **Stale** — `data/cache.js` already uses 0–100 schema, full COMBOS/BELTS/SCENARIOS/POSITIONS/SPAWNS |
| Anubis duplicate `source:` keys | **Stale** — one `source` per lineup; `screenshotSource` kept as extra link |
| Validator accepts 0.52 as valid | **Stale** — `inPctRange` rejects `0 < n < 1`; added map-level 0–1 scale warning |
| `b_execute_belt` 5 grenades | **Stale** — `b_belt` splits 5th grenade to `long_smoker` carrier |
| `index.html` Ancient title | **Stale** — title is `CS2 Utility Playbook` |
| `cs2_ancient_playbook.jsx` in root | **Stale** — not in repo root; `.claude/` ignored |

**Applied** in R-013:

- ESLint/gitignore `.claude/**`
- Single source of truth: `mapMeta.js` constants → validator; Cache not in `WIP_MAP_IDS`
- `ytSearch()` replaces seven per-map `yt()` copies
- `ScreenshotGallery` extracted + hardened (`lib/lineupMedia.js`, React image fallback, `stopPropagation`)
- Map load race guard; study URL tri-state comment; `dominantUtil` null fallback
- Bonus map badge in selector (`MAP_POOL`)
- Per-field empty screenshot warnings in validator
- Ancient/overpass: removed **misleading** placeholder screenshots; honest notes + video fallback
- `MapDataContext` default `undefined` (loading uses `null` value intentionally)

**Deferred** (correct but lower ROI now): full `App.jsx` component split, inline-style hoisting, precomputed `AREAS` per map.

---

## Changelog (context document)

| Date | Change |
|------|--------|
| 2026-05-20 | Initial `PROJECT_CONTEXT.md`: vision, R-001–R-011, engineering decisions, snapshot, maintenance rules |
| 2026-05-20 | R-012 production: lazy maps, ESLint, deploy workflow, validate pipeline, manifest, print CSS, v1.0.0 |
| 2026-05-20 | R-013 audit reconciliation: ScreenshotGallery extract, ytSearch dedup, data honesty fixes, config ignores |
| 2026-05-20 | R-014 GitHub Pages: enable Pages (workflow source); fix deploy workflow permissions; live at davidpurvis.github.io/cs2-utility-playbook |

---

### R-014 — GitHub Pages deploy (2026-05-20)

| Item | Detail |
|------|--------|
| **Symptom** | `deploy.yml` failed at `configure-pages` with HTTP 404 — Pages not enabled on repo |
| **Fix** | Enable Pages via API/settings (source: GitHub Actions); remove invalid `administration: write` from workflow (broke workflow validation on push) |
| **Live URL** | https://davidpurvis.github.io/cs2-utility-playbook/ |
| **Deploy trigger** | Merge to `main` or `workflow_dispatch` |

---

## Template — new requirement

Copy into [Requirements log](#requirements-log):

```markdown
| R-0XX | YYYY-MM-DD | **Short title** — full ask in plain language | Open | Measurable done criteria | |
```

## Template — new engineering decision

```markdown
| **Short title** | Why we chose it | What we rejected |
```
