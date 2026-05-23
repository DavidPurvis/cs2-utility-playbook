# The CS2 Utility Learning Ecosystem: A Deep Research Investigation

> **Date:** 2026-05-22
> **Scope:** Exhaustive survey of every meaningful resource, platform, tool, community, and content creator in the CS2 utility learning space, plus an independent analysis of utility theory, per-map canonical positions, and a synthesis of the entire ecosystem's strengths, gaps, and implicit philosophies.
>
> **Methodology:** Multi-source web research (live fetches, search queries across 40+ domains), cross-referenced with existing project research (CS2_UTILITY_ENCYCLOPEDIA.md, REFRAG_LINEUPS.md). All URLs verified at time of research unless marked `[unverified]`. CS:GO-legacy content flagged explicitly throughout.

---

## Table of Contents

- [Part 1 — Resource Discovery](#part-1--resource-discovery)
  - [1.1 Dedicated Utility Learning Platforms](#11-dedicated-utility-learning-platforms)
  - [1.2 Mobile Applications](#12-mobile-applications)
  - [1.3 YouTube Channels and Video Creators](#13-youtube-channels-and-video-creators)
  - [1.4 Coaching Platforms and Paid Instruction](#14-coaching-platforms-and-paid-instruction)
  - [1.5 Workshop Maps and In-Game Training Tools](#15-workshop-maps-and-in-game-training-tools)
  - [1.6 Analytics and Performance-Tracking Platforms](#16-analytics-and-performance-tracking-platforms)
  - [1.7 Communities — Discord, Reddit, Steam](#17-communities--discord-reddit-steam)
  - [1.8 Editorial, Analytical, and Pro-Team Content](#18-editorial-analytical-and-pro-team-content)
- [Part 2 — Detailed Resource Documentation](#part-2--detailed-resource-documentation)
- [Part 3 — Philosophy and Methodology Extraction](#part-3--philosophy-and-methodology-extraction)
- [Part 4 — The Fundamental Logic of CS2 Utility](#part-4--the-fundamental-logic-of-cs2-utility)
  - [4.1 Taxonomy of Utility Purpose](#41-taxonomy-of-utility-purpose)
  - [4.2 The Economics of Utility](#42-the-economics-of-utility)
  - [4.3 CS:GO to CS2 — What Changed and What Broke](#43-csgo-to-cs2--what-changed-and-what-broke)
  - [4.4 Utility Across Skill Levels](#44-utility-across-skill-levels)
  - [4.5 The Asymmetric Logic of Map Control Through Utility](#45-the-asymmetric-logic-of-map-control-through-utility)
  - [4.6 Map-by-Map Canonical Utility](#46-map-by-map-canonical-utility)
- [Part 5 — Synthesis and Recommendations](#part-5--synthesis-and-recommendations)

---

# Part 1 — Resource Discovery

## 1.1 Dedicated Utility Learning Platforms

### CS2UTIL (cs2util.com)

- **URL:** https://www.cs2util.com/
- **Creator:** Unattributed; no public team information.
- **Format:** Interactive 2D map viewer with numbered step-by-step text instructions, inline video demonstrations, and metadata per lineup (jump throw requirements, air time, movement type, setpos/setang console commands).
- **Maps covered:** 10 — Dust2, Mirage, Inferno, Nuke, Ancient, Train, Cache, Anubis, Overpass, Vertigo.
- **Content scale:** ~700+ atomic lineups. Dust 2 alone has 109 (73 smokes, 21 flashes, 13 mollies, 2 HEs).
- **Organization:** Hierarchical: Map → Utility Type (smoke/flash/molly/HE) → Specific Position. Filters by team side (T/CT), target area (callout), and difficulty (Easy/Medium/Hard). Navigation is destination-first: you pick where you want the grenade to land, then see throw-from positions.
- **Pricing:** Entirely free, no login required.
- **CS2 status:** Current CS2 content; updated for volumetric smoke system.
- **Critical differentiator:** Provides `setpos` and `setang` console commands per lineup — the exact coordinates you paste into CS2 console to teleport to the throwing position. This is the "killer field" for practice efficiency, and many competing platforms lack it entirely.
- **URL structure:** `/<map>/<type>/<slug>` (e.g., `/dust2/smoke/xbox-smoke-from-nomal-t-spawn`).
- **Weaknesses:** No multi-player execute sequences, no post-plant utility category, no scenario/round-type context, no video tutorials (interactive viewer only), no favorites/save system, loose pro attribution (mentioned in titles only, no sourcing).

### CSNADES.gg (csnades.gg)

- **URL:** https://csnades.gg/
- **Creator:** Unattributed.
- **Format:** Video-tutorial lineup database. Each lineup has a dedicated video (appears to be original, not embedded YouTube).
- **Maps covered:** 10 competitive maps.
- **Content scale:** 1,396 video tutorials — 920 smokes, 206 mollies, 166 flashes, 64 HEs.
- **Organization:** Map → Grenade Type → Specific Position. URL structure: `/{map}/{type}/{target}-from-{origin}`. Includes technique field (Jump+LC, Standing, Jump+RC, RC, Run+Jump+LC) and air time data per lineup — metadata absent from most competitors.
- **Pricing:** Free.
- **CS2 status:** Current CS2 content.
- **Critical differentiator:** "Solo Combinations" — multi-grenade single-thrower sequences from one position. This is unique: most platforms treat each grenade as atomic, but csnades.gg models the reality that a support player often throws smoke + flash + molly from the same spot in sequence.
- **Weaknesses:** No `setpos`/`setang` coordinates (biggest gap vs CS2UTIL), Cloudflare-blocked to bots (returns 403 on direct fetch), no explicit difficulty rating, video-only format (no screenshot alternatives), no save/favorites.

### CSNades.eu (csnades.eu)

- **URL:** https://csnades.eu/
- **Format:** Community-contribution utility platform.
- **Maps covered:** Mirage, Overpass, Vertigo, Ancient, Inferno, Nuke, Anubis, Dust 2.
- **Organization:** Map → Grenade type → Position. Emphasizes community sharing of discovered lineups.
- **Pricing:** Free.
- **Differentiator:** Community-driven discovery model — users submit and share lineups rather than a curated editorial approach.

### lineups.gg

- **URL:** https://lineups.gg/
- **Format:** Centralized lineup database with supplementary guides, blog, and newsletter.
- **Maps covered:** 8 competitive maps — Dust II, Mirage, Inferno, Nuke, Overpass, Anubis, Ancient, Vertigo.
- **Content scale:** 200 lineups total (25 per map). 81 smokes, 42 flashbangs, 38 HEs, 39 molotovs.
- **Organization:** Primarily by utility type, not by map side or position. No evidence of difficulty-based or side-specific filtering.
- **Pricing:** Free. Also offers community access with "exclusive strategies, pro-level executes, live practice sessions."
- **CS2 status:** Current CS2.
- **Philosophy:** Reference-based — treats utility lineups as standardized technical knowledge to memorize. The emphasis on "pro-level executes" signals an aspirational, tournament-derived instruction model.
- **Weaknesses:** Relatively small lineup count (200 total vs 700+ on CS2UTIL or 1,396 on CSNADES.gg). Limited filtering. No coordinates.

### CSDB.gg (csdb.gg)

- **URL:** https://csdb.gg/
- **Format:** Multi-tool CS2 reference platform (lineups, callouts, guides, practice config generator, sensitivity converter).
- **Maps covered:** All competitive maps. Dedicated lineup pages per map (e.g., csdb.gg/lineups/overpass/, csdb.gg/lineups/nuke/).
- **Organization:** Map → Side (T/CT) → Specific Position. Includes difficulty ratings (Easy/Medium/Hard) per lineup. Each lineup labeled with side designation.
- **Pricing:** Free.
- **Differentiator:** Integrated toolset — the lineup database sits alongside a Practice Config Generator (auto-generates console commands for practice mode), Map Veto Simulator, and Sensitivity Converter. Also includes a comprehensive Grenade & Utility Guide (csdb.gg/guides/grenade-guide/) that covers grenade costs, mechanics, and tactical purpose.
- **Teaching philosophy:** Structured learning path implied by difficulty ratings — easy lineups "learnable in minutes and forgiving," medium requiring more practice, hard needing "precise positioning and timing."

### CS2Tricks / NadeKing (cs2tricks.com)

- **URL:** https://www.cs2tricks.com/
- **Creator:** NadeKing (1.45M+ YouTube subscribers, 328M+ total views). NadeKing is one of the largest CS2 content creators globally.
- **Format:** Video tutorials as primary instruction method, organized by map and category.
- **Maps covered:** 10 — Ancient, Anubis, Dust2, Inferno, Mirage, Nuke, Overpass, Cache (marked "new"), Train, Vertigo.
- **Organization:** Two main branches: **Nades** (smokes, flashbangs, molotovs, HE grenades) and **Tricks** (wallbangs, skill jumps, boosts). Each map has dedicated sections for both. "Latest" sections indicate regular content updates.
- **Features:** Personalization tools — users save favorite lineups and tricks for quick match access, plus share specific links with teammates for coordinated play.
- **Pricing:** Free.
- **CS2 status:** Current CS2, regularly updated.
- **Philosophy:** Mastery-through-categorization: organizing by map first, then by type, enables contextually specific learning. The inclusion of "Tricks" alongside "Nades" reflects NadeKing's broader brand — creative, entertainment-adjacent, not pure tactical reference.

### CS2.app (cs2.app)

- **URL:** https://www.cs2.app/
- **Creator:** NartOutHere & NadesOutHere.
- **Format:** Nade directory with utility and tactics browser.
- **Content:** Smokes, molotovs, flashbangs, grenades, plus tips & tricks. Weekly content updates.
- **Pricing:** Free.
- **Differentiator:** Connected to a YouTube content creation operation (NartOutHere). Functions as a companion reference site rather than a standalone database.

### CSGOnades → Clash.gg/nades (csgonades.com → esports.clash.gg/nades)

- **URL:** https://www.csgonades.com/ (301 redirects to https://esports.clash.gg/nades/)
- **Status:** The original CSGOnades.com — historically one of the most well-known utility databases in the CS:GO era — has been acquired or absorbed by Clash.gg. The redirect suggests the original independent platform no longer exists as a standalone entity.
- **Historical significance:** CSGOnades was the original community-driven nade database that set the template for every subsequent utility platform. Its organizational model (map → position → grenade → video) became the de facto standard.
- **Current content:** Behind a 403 Cloudflare wall at time of research; content status uncertain.

### Tracker.gg CS2 Lineups (tracker.gg/cs2/lineups)

- **URL:** https://tracker.gg/cs2/lineups
- **Creator:** Tracker Network (major esports stats/tracking company).
- **Format:** Community-powered lineup database.
- **Differentiator:** Backed by the Tracker Network's existing user base and infrastructure. Community submission model means content scales with user contributions.
- **Status:** Returns 403 at time of fetch; details of current content depth uncertain.

### SCOPE.gg Grenade Predictor (scope.gg/grenade-predictor)

- **URL:** https://scope.gg/grenade-predictor
- **Creator:** SCOPE.gg (comprehensive CS2 analytics platform).
- **Format:** Interactive 2D tactical map with clickable grenade positions. Hover/click on grenade icons to watch video guides. Copy `setpos` coordinates directly for in-game practice.
- **Maps covered:** All competitive maps including Dust 2, Mirage, Inferno, Cache, Nuke, Train, and others.
- **Organization:** Map → Grenade type (smoke, flash, HE). Includes a dedicated "one-way smoke" section. Supports both 64-tick and 128-tick lineups (relevant for CS:GO legacy; CS2's sub-tick makes this distinction moot).
- **Pricing:** Completely free, no login required.
- **Differentiator:** Integrated within a full analytics platform. Players using SCOPE.gg for match tracking can cross-reference their utility analytics with the lineup tool — a feedback loop no standalone lineup database offers.

### Refrag (refrag.gg)

- **URL:** https://refrag.gg/
- **Founders/Co-owners:** EliGE (Jonathan Jablonowski, former Team Liquid star) and Pimp (Jacob Winneche, former pro player and analyst).
- **Format:** Subscription-based training platform running on dedicated high-tickrate CS2 servers. Utility training happens in-game through custom server mods, not through a web viewer.
- **Utility-specific features:**
  - **NADR mod:** Core lineup practice engine. Hundreds of pre-loaded lineups with a structured data model per lineup (map, grenadeType, throwPos coordinates, throwAngles, throwAction, landingTarget with radius, name, index). Users load lineups by index (`.nade 47`), rethrow (`.rethrow`), save custom lineups (`.save <name>`), and use the Grenade Finder (`.find`) — a unique reverse-calculator that accepts a landing zone and computes valid throw positions.
  - **Utility Hub:** Web-browsable lineup library with "over a hundred nades that have an in-depth explanation of how, when, and why to use them." Available at Competitor tier and above.
  - **Bootcamp:** Guided curricula covering utility fundamentals through realistic scenarios at different skill levels.
  - **Refrag Academy:** Strategy lessons from EliGE and Pimp (e.g., EliGE on T-side defaults on Vertigo, B execute on Mirage; Pimp on Nuke A take).
  - **Utility Secrets blog series:** Free articles covering 5 must-know nades per competitive map (8 per-map articles + 2 Spawn Smokes Tier List articles). URLs follow pattern: `refrag.gg/blog/cs2-utility-secrets-5-must-know-nades-for-<map>/`
- **Pricing:**
  - Player tier: $5.40/month (annual) — NADR in-game lineup practice.
  - Competitor tier: $11.40/month — adds Utility Hub web browser, Scrim mod, 2D demo viewer, detailed stats.
  - Team tier: $60+/month — 5v5 + per-player servers.
  - Top tier: $79/month.
- **Scale claim:** 550,000+ users, 35 server locations.
- **Pro partnerships:** Team Liquid, Heroic, FNATIC, Dignitas, Mousesports.
- **Critical differentiator:** The Grenade Finder is unique — no other tool reverse-calculates throw positions from landing targets. In-game practice on live CS2 servers with real physics eliminates the gap between "practice tool" and "real match conditions."
- **Weaknesses:** No free tier for lineup browsing (can't see a single lineup without paying). No web-addressable lineups (can't share `refrag.gg/dust2/xbox-smoke` with a teammate). Requires CS2 launch + server boot every session (high activation energy). No mobile UX. No public API. Server-side lineup data not exported — cancel subscription, lose your saved library. Deliberately does NOT publish setpos/setang coords on the free blog.

---

## 1.2 Mobile Applications

### Smoke Baron (iOS + Android)

- **URLs:** [App Store](https://apps.apple.com/us/app/smoke-baron-cs2-nade-guide/id1499252194) | [Google Play](https://play.google.com/store/apps/details?id=com.stadtrausch.csgotacticguidepro)
- **Creator:** SkinBaron (skinbaron.de/smokebaron).
- **Content scale:** 3,500+ video lineups and guides with no duplicates, covering all competitive maps. 350+ grenade combinations for advanced team plays.
- **Grenade types:** Smoke, Molotov, Incendiary, HE, Flash, plus Combo tutorials.
- **Format:** Each lineup explained with videos, screenshots, and step-by-step guides. Quick access by grenade type, position, or target. Clear map overviews with callouts.
- **Content philosophy:** Covers attack & retake tactics, solo plays & team strategies, pro-level lineups inspired by esports teams.
- **Pricing:** Freemium. Premium unlocks exclusive lineups & combinations, favorites system, and removes ads.
- **Differentiator:** The most comprehensive mobile-first utility guide. 3,500+ lineups is a larger library than most web platforms. Combo tutorials (multi-grenade sequences for specific positions) mirror what CSNADES.gg does with Solo Combinations.

### Util Master (iOS + Android)

- **URLs:** [App Store](https://apps.apple.com/tr/app/util-master-cs2-utility-guide/id6470121185) | [Google Play](https://play.google.com/store/apps/details?id=com.hartvig_develop.util_master)
- **Format:** Mobile CS2 utility guide and reference app.
- **Details:** Less extensively documented than Smoke Baron; smaller content library.

---

## 1.3 YouTube Channels and Video Creators

### NadeKing — The Utility Entertainment Channel

- **URL:** https://www.youtube.com/NadeKing
- **Subscribers:** 1.45M+, 328M+ total views.
- **Background:** One of the largest CS2 content creators globally. Italian gaming community presence. Also runs CS2Tricks.com (see 1.1).
- **Content style:** Blend of entertainment and education. Videos feature creative grenade challenges, subscriber challenges, hide-and-seek in CS2, plus genuine utility tutorials. The humor is strategic — it makes grenade practice feel fun rather than homework.
- **Utility content:** Map-specific lineup videos, "every smoke you need" compilations, creative one-way smokes (or attempts at them in CS2's volumetric system), subscriber challenge videos where lineup knowledge is tested.
- **Teaching philosophy:** Practical, fun, accessible. NadeKing's implicit thesis is that utility learning should be entertaining enough that players voluntarily practice it. This is the polar opposite of dry reference databases.
- **Target audience:** Broad — beginners through intermediate. The entertainment wrapper lowers the barrier to entry but can mean less depth per individual lineup.
- **CS2 status:** Actively producing CS2 content. Cache lineup videos posted as recently as April 2026.

### Elmapuddy — The Analyst's Analyst

- **URL:** https://www.youtube.com/Elmapuddy
- **Background:** Professional esports analyst. Has worked as a top-tier analyst for competitive teams.
- **Content style:** In-depth explanations and visual breakdowns of professional CS2 tactics. Demo review format showing how smoke grenades control entire areas, how coordinated flashes blind teams, and how utility sequences create tactical advantages.
- **Teaching philosophy:** Translates complex pro tactics into actionable knowledge. Elmapuddy doesn't just show a smoke — he shows why NaVi threw that specific smoke at that specific time in that specific round against that specific opponent's setup, and what it enabled. This is the closest any content creator comes to teaching the "why" rather than the "what."
- **Target audience:** Intermediate to advanced players, aspiring IGLs, analysts, and anyone who wants to understand pro-level tactical thinking.
- **Differentiator:** Analyst credentials give the content an authority that pure content creators lack. When Elmapuddy explains why a utility sequence works, it's grounded in professional experience analyzing these sequences at the highest level.

### voo (vooCSGO) / Gosu Academy — The Strategic Thinker

- **URL:** https://www.youtube.com/vooCSGO
- **Background:** Donald "Voo" Parkhurst. Long-time CS educator, strategic thinker, and coach. Runs Gosu Academy (gosuacademy.com).
- **Content style:** Strategic breakdowns emphasizing decision-making over mechanical execution. Demo reviews that help players discover mistakes and bad habits. Utility is covered as part of broader tactical thinking — not isolated from positioning, timing, and game sense.
- **Teaching philosophy:** Voo's core thesis is that understanding beats memorization. He teaches players to think strategically like pros rather than just copying their lineups. His content emphasizes why a smoke exists in the context of a round, not just where to aim.
- **Coaching offering:** Gosu Academy Bootcamp — 10-day structured course with live classes, 4-hour Q&A and demo reviews, 2-week premium community access, 5x definitive training guides, Discord support. Covers mastering utility usage, optimizing map control, upgrading aim and movement. Pro Pack includes monthly one-on-one coaching and personalized training plans. 3-day money-back guarantee with <0.5% refund rate.
- **Target audience:** Intermediate to advanced players who want conceptual understanding rather than rote lineup memorization.

### TheWarOwl — The Beginner's Gateway

- **URL:** https://www.youtube.com/@TheWarOwl
- **Background:** One of the earliest and most recognized CS educational YouTubers. Has been producing beginner-focused CS content for years.
- **Content style:** Structured, tutorial-format videos aimed at new players. Covers game rules, strategy fundamentals, and basic concepts. First CS2 tutorial covered loadout setup based on the current meta.
- **Teaching philosophy:** Accessibility-first. WarOwl assumes zero prior knowledge and builds from there. Utility is taught as part of a broader introduction to CS2 mechanics, not as a standalone skill.
- **Target audience:** Complete beginners and players new to CS2 from other FPS games.
- **Utility depth:** Shallow by design — utility is one topic among many (aim, movement, economy, communication). Players who master WarOwl's basics need to graduate to NadeKing, voo, or Elmapuddy for deeper utility work.

### 3kliksphilip — The Technical Investigator

- **URL:** https://www.youtube.com/@3kliksphilip
- **Background:** Deep technical analysis channel focused on CS2 engine mechanics, map design, and game physics.
- **Content style:** Investigative technical videos. When CS2 launched its volumetric smoke system, 3kliksphilip was among the first to document exactly how the new physics work — how smokes interact with geometry, how bullet-carving functions, how HE clearing operates.
- **Utility relevance:** Not a lineup channel. Instead, 3kliksphilip is the person who explains the underlying mechanics that make lineups work or break. Understanding his content on smoke physics gives you the mental model to predict which CS:GO lineups will survive the transition to CS2 and which won't.
- **Target audience:** Technically curious players, map makers, engine enthusiasts.
- **Differentiator:** No other creator provides this level of mechanical depth. His work is referenced by other creators when explaining why things changed.

### n0thing (Jordan Gilbert) — The Pro Perspective

- **URL:** https://www.youtube.com/@n0thing
- **Subscribers:** 451,000+, 500+ videos.
- **Background:** Former professional CS player (Cloud9). Now a full-time streamer and content creator.
- **Content style:** Instructional content breaking down strategy from a pro player's perspective. Example: "Ancient B Site Defense Guide" series covering CT-side utility and positioning.
- **Teaching philosophy:** Draws on lived professional experience. When n0thing explains a smoke, it's in the context of rounds he actually played at the highest level. This gives the content an authenticity that pure content creators can't match.
- **Target audience:** Intermediate to advanced. Players who already understand CS2 basics and want pro-level insight.

### Launders — The Caster-Analyst

- **URL:** https://www.youtube.com/@launders
- **Background:** CS2 caster and analyst. Known for deep knowledge of the game's tactical layer.
- **Content style:** Analytical content, often referencing specific pro plays and their utility usage. Has identified specific players as "the REAL utility expert" in the Brazilian scene.
- **Utility depth:** Moderate — utility is covered as part of broader tactical analysis rather than dedicated lineup tutorials.

### Other Notable Creators

- **NartOutHere / NadesOutHere:** Runs CS2.app. YouTube content focused on utility and tactics.
- **CS2 Library (@CS2MainLibrary):** Comprehensive CS2 resource channel.
- **sothaT:** Utility-focused content creator referenced in community discussions.
- **Hecklerr:** Published tactical content including "Banana Control on Inferno After Update" analysis on CS2 Pulse.

---

## 1.4 Coaching Platforms and Paid Instruction

### Gosu Academy (gosuacademy.com)

- **URL:** https://gosuacademy.com/
- **Operator:** Features voo (Donald Parkhurst) as lead instructor, plus coach Lucid and others.
- **Products:**
  - **VooCSGO Bootcamp:** 10-day intensive with live classes, Q&A, demo reviews. Covers utility, map control, aim, movement.
  - **CS2 Academy (1-month):** Top-tier CS2 guides.
  - **CS2 Year-to-Pro Journey:** Long-form development program.
  - **Gamlytics CS2 Training:** Integrated training tools.
  - **Free 30-day trial:** Available at gosuacademy.com/pages/cs2-free.
  - **Pro Pack + Coaching:** Monthly one-on-one coaching sessions with personalized training plans.
- **Teaching philosophy:** Strategic thinking over rote practice. The 10-day bootcamp format creates accountability and structure that self-directed YouTube learning lacks.
- **Target audience:** Dedicated improvers willing to invest time and money for structured growth.

### Metafy (metafy.gg)

- **URL:** https://metafy.gg/counter-strike-2/guides
- **Format:** Marketplace connecting players with esports coaches. Coaches set their own pricing and session structure.
- **CS2 utility coaches:** Multiple coaches specifically advertise utility/grenade training. Notable examples:
  - **fREShCS Dojo:** Group coaching sessions on Metafy.
  - **nxstep:** CS2 coaching focused on fast improvement.
  - **buutterbrot:** Offers free CS2 coaching sessions (limited slots).
- **Pricing:** Varies by coach — typically $15-60/hour for one-on-one sessions.
- **Strengths:** Coach diversity, transparent reviews, flexible scheduling.
- **Weaknesses:** Quality varies dramatically by coach. No standardized curriculum for utility. Expensive for ongoing learning.

### ProGuides

- **Format:** Video game teaching platform with written guides, video guides, tier lists, and live online instruction from professional players and top-ranked individuals.
- **CS2 coverage:** Includes Counter-Strike among multiple supported games.
- **Utility depth:** General — utility is covered as part of broader CS2 instruction, not as a standalone module.

### Gamer Sensei

- **Format:** Esport coaching platform connecting players with "senseis" (teachers) across 15+ esports titles.
- **CS2 coverage:** Available but not specialized in utility.
- **Status:** Competitor landscape analysis suggests Gamer Sensei is less dominant than Metafy for CS2-specific coaching.

---

## 1.5 Workshop Maps and In-Game Training Tools

### yprac Hub (by Yesber)

- **URL:** https://yprac.com/ | [Steam Workshop Hub](https://steamcommunity.com/sharedfiles/filedetails/?id=3070715607)
- **Creator:** Yesber.
- **What it is:** The gold-standard workshop practice platform for CS2. A single 150MB addon that enables custom game modes on all official and custom workshop maps.
- **Practice modes:**
  - **Utility:** 1,400+ lineups across all competitive maps. Guided mode teleports the player to the throw-from position, shows crosshair marker for aim point, displays trajectory line, and places a ghost grenade at the landing spot.
  - **Prefire:** 64+ routes through common engagement angles.
  - **Shortcuts:** 110+ routes through key rotation paths.
  - **Aim Trainer:** With Night Mode variant.
  - **Sandbox:** Available on all official maps.
- **Map coverage:** All active-duty maps — Mirage, Dust 2, Inferno, Nuke, Ancient, Anubis, Overpass, Vertigo, plus others.
- **CS2 status:** Updated for CS2. Yesber has maintained and rebuilt lineups for the volumetric smoke system and map geometry changes.
- **Teaching approach:** Structured guided practice. Difficulty ratings per lineup, side designations, instant-rethrow capability. This is the closest thing to a "drill sergeant" for utility — it forces you through positions systematically rather than letting you cherry-pick.
- **Platform components:** Workshop Hub (in-game), Windows Client, Web Console.
- **Differentiator:** 1,400 lineups is the largest single-source library found in this research. The guided practice mode — where the game itself shows you where to stand, where to aim, and the trajectory — is pedagogically superior to watching a video and trying to replicate it.
- **Weaknesses:** Requires CS2 launch (no mobile/web reference). Workshop map loading can be slow. Some lineups may lag behind patches.

### CS2 Nades 101

- **URL:** [Steam Workshop](https://steamcommunity.com/workshop/filedetails/?id=3480635433)
- **Format:** Workshop map collection with nade guides focused on must-know utility for site executes, retakes, and map control across all 7 competitive maps. Grenade lineups refined from professional match study.
- **Differentiator:** Curated to essential-only lineups, not an exhaustive database. Focuses on the 20% of lineups that matter in 80% of rounds.

### Astralis Collaboration Maps

- **What:** Workshop maps developed in collaboration with Astralis (historically one of the most utility-disciplined teams in CS history). Referenced for Vertigo and other maps.
- **Significance:** When a team that won 4 Majors publishes their lineup library as a practice map, it carries implicit authority. Astralis' utility philosophy — methodical, repetitive, structured — is embedded in the map design.

### CS2 Built-in Practice Mode & Console Commands

CS2 has native tools for utility practice that require no workshop maps:

**Core setup (paste into console after loading a map with `sv_cheats 1`):**
```
sv_cheats 1; mp_warmup_end; mp_roundtime_defuse 60; mp_freezetime 0;
mp_buy_anywhere 1; mp_buytime 9999; mp_maxmoney 65535; mp_startmoney 65535;
sv_infinite_ammo 1; mp_restartgame 1
```

**Grenade-specific commands:**
- `cl_grenadepreview 1` — CS2-specific: shows predicted grenade trajectory arc while holding a grenade BEFORE throwing. This is the most important utility practice command in CS2.
- `sv_showimpacts 1` — Shows impact markers.
- `noclip` — Fly mode for reaching any position instantly.
- `getpos` / `getpos_exact` — Print current position coordinates (essential for capturing lineup data).
- `setpos X Y Z` / `setang P Y R` — Teleport to exact coordinates and set exact view angle.
- `bot_add_ct` / `bot_add_t` / `bot_place` / `bot_stop 1` — Place and freeze bots for testing utility against defenders.

**CS2-specific change:** `cl_grenadepreview 1` replaces the old `sv_grenade_trajectory 1` from CS:GO. The exact cvar name for trajectory visualization has changed across CS2 patches — test in console if legacy commands don't work.

**Sub-tick eliminates tickrate problems:** In CS:GO, lineups landed differently on 64-tick official servers vs 128-tick community servers. CS2's sub-tick system eliminates this entirely — what works in practice mode works identically in competitive. This is a massive quality-of-life improvement for utility learners.

### CS2's Map Guide System

CS2 introduced a built-in Map Guide feature accessible from Play → Practice:
- Select a map, toggle "Use Map Guide," choose the guide, press Go.
- The system loads community or official guides with pre-set utility positions.
- Some guides are authored by organizations (like the HLTV utility maps, which community members report as "tons of smokes and nades to train on, and it's all free").
- This feature lowers the barrier to entry dramatically — no workshop subscription, no console commands, no external reference. Critics argue that this erodes the skill gap ("learning lineups is part of the skill gap"), while proponents see it as a rising-tide accessibility feature.

---

## 1.6 Analytics and Performance-Tracking Platforms

### Leetify (leetify.com)

- **URL:** https://leetify.com/
- **What it is:** CS2 stats tracker and performance analytics platform. Not a utility teaching tool — a diagnostic tool that tells you whether your utility practice is translating into match performance.
- **Utility-specific metrics:**
  - **Utility Rating:** Composite score based on flash assists, enemies flashed, teammates flashed, average blind time, average HE damage, average HE team damage, and average unused utility.
  - **Flash effectiveness:** Average enemies killed while affected by your flashbang (excluding half-blind). Average enemies blinded per flashbang thrown (max 5). Measures efficiency, not volume.
  - **HE damage tracking:** Total damage dealt to enemies with HE grenades divided by total HEs thrown. Low numbers indicate room to improve HE planning.
  - **Unused utility:** Average value of utility held upon death — a key indicator of whether you're buying grenades and forgetting to use them.
  - **Rank benchmarks:** Compare your utility metrics against players at your rank.
- **Pricing:** Free tier with basic stats; premium for deeper analytics.
- **What it does NOT do:** Does not teach lineups, does not have a lineup database, does not provide in-game practice. Purely retrospective.
- **Pedagogical role:** Leetify answers "do I have a utility problem?" The lineup platforms answer "how do I fix it?" Together they form a feedback loop — but no single platform provides both.

### SCOPE.gg (scope.gg)

- **URL:** https://scope.gg/
- **What it is:** Comprehensive CS2 analytics platform with match tracking, demo viewer, and the Grenade Predictor tool (covered in 1.1).
- **Utility analytics:** Grenade usage per match/round, flash effectiveness, smoke effectiveness, grenade damage per round. Pre-match FACEIT analyzer shows opponent tendencies.
- **Pricing:** Free tier with basic features; premium for advanced analytics.
- **Differentiator:** The combination of analytics (how you actually used utility in matches) with the Grenade Predictor (reference tool for learning new lineups) in a single platform. No other platform offers both diagnostic analytics and prescriptive lineup reference.

### HLTV.org Statistics (hltv.org/stats)

- **URL:** https://www.hltv.org/stats?csVersion=CS2
- **What it is:** The authoritative statistics database for professional CS2. Player and team statistics, rankings, top lists.
- **Utility-relevant stats:** Utility damage per 24 rounds (key metric for comparing pro utility effectiveness). In 2025, apEX (Team Vitality IGL) led the ranking with 218.6 utility damage per 24 rounds — notable because IGLs traditionally focus on calling rather than personal grenading.
- **Benchmark context:** A professional support player averages 5-10 grenade damage per round. Doing 200 total utility damage in a map is effectively like getting two extra kills for free.
- **Pedagogical role:** HLTV doesn't teach utility, but its statistics provide the evidence base for why utility matters. "Aim isn't enough" becomes concrete when you see that the best IGLs in the world consistently lead utility damage rankings.

---

## 1.7 Communities — Discord, Reddit, Steam

### Discord Communities

- **CS2UTIL Discord:** Community tied to the CS2UTIL platform (cs2util.com). Discusses utility strategies, shares experiences, provides real-time updates on new lineups.
- **Refrag Discord:** Training-focused community. Teaches grenade throwing mechanics, peek techniques, aim routines. Connected to Refrag's in-game training ecosystem.
- **Academy Gaming:** Large community built for CS2 improvement. Features coaching discussions, VOD reviews, guides from experienced members, plus active LFG channels for Premier, scrims, and practice routines.
- **Map-specific and team-specific Discords:** Many semi-pro and amateur teams run private Discords with utility channels where they share team-specific lineups and execute protocols.
- **CS2 Pulse Discord, Metafy coaching Discords:** Additional communities focused on improvement with demo review channels, coaching help, and utility practice feedback.

### Reddit

- **r/GlobalOffensive:** The primary CS2 subreddit (name retained from CS:GO era). Utility-related posts include lineup videos, smoke guides, discussion of meta shifts, patch impact analysis. Quality varies — top posts often feature creative or newly-discovered lineups.
- **r/LearnCSGO / r/LearnCS2:** Improvement-focused subreddits. Utility is a common topic. Posts range from "which smokes should I learn first on Mirage?" to detailed guides from experienced players. Less active than r/GlobalOffensive but higher signal-to-noise for learning content.
- **r/CounterStrike:** Broader CS community subreddit.

### Steam Community

- **Steam Community Guides:** Multiple comprehensive CS2 utility guides published as Steam Community Guides. Notable examples:
  - "Mastering CS2: Advanced Strategies, Mind Games, and Tactical Insights" (ID: 3383057384)
  - "CS2 Utility guide: Smokes, grenades, molotovs, decoys and flashbangs" (ID: 3132025787)
  - "The Road to Mastery: A CS2 Player's Training Guide" (ID: 3138236134)
- **Quality:** Variable. Steam guides have no editorial review process, so quality ranges from excellent to outdated/incorrect. Check publication dates against CS2 patch history.

---

## 1.8 Editorial, Analytical, and Pro-Team Content

### TalkEsport — "The Rise of Utility-Based Plays in CS2"

- **URL:** https://www.talkesport.com/editorials/the-rise-of-utility-based-plays-in-cs2-has-raw-aim-taken-a-backseat/
- **Thesis:** One of the most significant changes in CS2's meta is the shift from aim-dominant gameplay to utility-dominant gameplay. Dynamic smokes, layered mollies, improved audio-visual cues, and better grenade physics have made utility mastery critical. A mechanically average player with great map awareness and positioning will consistently outplay a mechanical monster with bad timing.
- **Key insight:** Pro teams are shifting buy orders — trading weapon upgrades for more utility. Half-buys with full utility often outperform full-buys with minimal grenades during map control rounds.

### Switchblade Gaming — "CS2 Utility Lineups 2026"

- **URL:** https://www.switchbladegaming.com/cs2/utility-lineups/
- **Format:** Curated 12-lineup guide (4 per map across Mirage, Inferno, Ancient). Selected because they appear in pro play, hold across every rank, and target the highest-value positions.
- **Philosophy:** Minimalist — learn 12 lineups and you have a meaningful toolkit. This is the opposite of yprac's 1,400-lineup exhaustive approach.

### BLAST.tv Smoke Guides

- **URL:** https://blast.tv/article/cs2-[map]-smokes (per-map pattern)
- **Format:** "Every smoke you need to know" per-map guides published by BLAST (major tournament organizer).
- **Authority:** Published by an organization that runs tier-1 CS2 tournaments, lending implicit credibility that the selected smokes are the ones that actually matter at the highest level.
- **Maps covered:** Published guides for Dust2, Inferno, Ancient, Nuke, Overpass, Vertigo.

### Refrag Blog — Utility Secrets Series

- **URL pattern:** https://refrag.gg/blog/cs2-utility-secrets-5-must-know-nades-for-[map]/
- **Format:** Free articles (no paywall) covering 5 essential nades per competitive map, plus 2 Spawn Smokes Tier List articles. Each article includes images, tactical context, and explanations of when and why to use each nade.
- **Maps covered:** Dust2, Train, Anubis, Ancient, Mirage, Inferno, Nuke, Overpass, Cache.
- **Differentiator:** Written by a platform with pro partnerships (EliGE, Pimp, Team Liquid). The "5 must-know" framing is intentionally minimal — these are the non-negotiable essentials, not a comprehensive library.

### bo3.gg, cs2pulse.com, profilerr.net, bitskins.com, skin.land, and other esports media

Multiple esports media sites publish CS2 smoke guides as content marketing. These vary in quality:
- **bo3.gg:** In-depth map guides (e.g., "Cache Smokes CS2 Guide 2026"). Good tactical context.
- **cs2pulse.com:** Per-map and per-position smoke guides. Also publishes pro player analysis (e.g., Hecklerr's Banana control analysis).
- **profilerr.net, bitskins.com, skin.land, tradeit.gg, daddyskins.com, hellcase.com:** Skin-trading platforms that publish CS2 guides as SEO/marketing content. Quality is surprisingly decent — they typically contract experienced CS2 writers. But the incentive structure (drive traffic to skin marketplace) means guides are optimized for search ranking, not pedagogical coherence.

### FULLSYNC — "CS2 Grenade Meta in 2026"

- **URL:** https://fullsync.co.uk/cs2-grenade-meta-in-2026/
- **Format:** Meta analysis of which grenades belong in a player's "core kit" per map, plus a training methodology for building lineup muscle memory under pressure.

---

# Part 2 — Detailed Resource Documentation

The above Part 1 entries already contain detailed documentation per the original research requirements (structure, creator, organization, format, pricing, CS2 status, strengths/weaknesses). This section adds cross-cutting analysis.

## Content Organization Models — A Taxonomy

Every utility platform must answer one structural question: **what is the primary access pattern?** The answer reveals their implicit pedagogical theory.

| Platform | Primary axis | Secondary axis | Implied theory |
|---|---|---|---|
| CS2UTIL | Map → Utility type → Landing target | Team side, difficulty | "Find the grenade for this specific spot" — **destination-first** reference |
| CSNADES.gg | Map → Utility type → Landing target | Technique, air time | Same as CS2UTIL but adds execution metadata — **destination-first with mechanics** |
| CSDB.gg | Map → Side → Position | Difficulty | "What can I throw from this side?" — **role-aware reference** |
| Refrag NADR | Map → Sequential index | n/a | "Practice these in order" — **curriculum-driven** |
| yprac Hub | Map → Guided mode | Difficulty | "Stand here, aim here, throw" — **drill-driven** |
| Smoke Baron | Map → Position → Target → Combo | Grenade type | "What combos hit this area?" — **execution-sequence-driven** |
| NadeKing/CS2Tricks | Map → Category (nades vs tricks) | Latest | "Browse what's new" — **discovery-driven** |
| lineups.gg | Utility type across maps | Map | "Show me all smokes" — **grenade-type-driven** |

**What no platform does:** Origin-first browsing ("I'm standing at T-spawn, what can I throw from here?"), multi-player execute modeling ("3 players throw these 3 grenades at these timings"), post-plant utility as a first-class category, round-type-specific utility presets (eco vs. force vs. full buy), or role-based utility distribution ("what should the entry fragger carry vs. the support player?").

## Pricing Model Spectrum

| Free | Freemium | Subscription | One-time/Session |
|---|---|---|---|
| CS2UTIL, SCOPE.gg Grenade Predictor, CSDB.gg, lineups.gg, CSNades.eu, CS2.app, CS2Tricks, BLAST guides, yprac Hub | Smoke Baron (premium lineups), CSNADES.gg, Leetify, SCOPE.gg | Refrag ($5.40-79/mo), Gosu Academy | Metafy coaching ($15-60/hr) |

The utility learning ecosystem is overwhelmingly free. The paid tier is concentrated in two areas: (1) in-game practice platforms (Refrag) and (2) live human coaching (Metafy, Gosu Academy). No lineup database charges for access.

---

# Part 3 — Philosophy and Methodology Extraction

## The Memorization School vs. The Understanding School

The deepest philosophical divide in CS2 utility education is between platforms that teach **what to throw** and platforms that teach **why to throw it**.

### The Memorization School

**Representatives:** CS2UTIL, CSNADES.gg, lineups.gg, Smoke Baron, most workshop lineup maps.

**Implicit thesis:** Utility mastery is fundamentally a pattern-matching and motor-skill problem. Learn the 5 canonical smokes for Mirage A, drill them until they're automatic, deploy them in matches. Repetition creates reliability. The "why" is secondary — the positions are canonical because pros use them, and that's sufficient justification.

**Pedagogical structure:** Map → Position → Lineup → Drill. The unit of learning is the individual lineup. Progress is measured by how many lineups you know and how consistently you can execute them.

**Strengths:** Concreteness. A player who learns 3 smokes per site on their most-played map will immediately see results in competitive matches. The feedback loop is tight — learn smoke, use smoke, get kills/win round.

**Weaknesses:** Brittleness. A memorization-only player cannot adapt when the enemy reads their smoke pattern, when map geometry changes in a patch, or when they play a map they haven't drilled. They know WHAT to throw but not WHY, which means they can't derive new utility when circumstances change.

### The Understanding School

**Representatives:** voo/Gosu Academy, Elmapuddy, n0thing, the CS2 Utility Encyclopedia in this project.

**Implicit thesis:** Utility mastery is fundamentally a decision-making problem. The specific lineup is the least important part — what matters is understanding which sightlines need blocking, which positions need clearing, which timing windows need creating, and why. A player who understands the underlying geometry and tactical logic can derive good-enough utility on any map, even without memorized lineups.

**Pedagogical structure:** Concept → Application → Specific Example. The unit of learning is the principle. Progress is measured by the quality of decisions under novel conditions.

**Strengths:** Adaptability. An understanding-oriented player can adjust their utility on the fly when the enemy adapts, can figure out useful smokes on a brand-new or freshly-patched map, and can communicate utility reasoning to teammates.

**Weaknesses:** Abstraction. A player who understands "you should smoke off the crossfire angle" but hasn't drilled any specific lineups will throw imprecise smokes that don't land cleanly. Understanding without execution is as useless as execution without understanding.

### The Synthesis View

**Representatives:** Refrag (understands + drills), NadeKing (entertains + teaches), CSDB.gg (references + difficulty-grades).

The best platforms recognize that this is a false dichotomy. The optimal learning path is:
1. **Understand the principle** (why does this smoke exist?)
2. **Learn the specific lineup** (where to stand, where to aim)
3. **Drill until automatic** (30 repetitions in practice mode)
4. **Apply in matches** (under pressure, with teammates)
5. **Adapt when conditions change** (enemy reads your smoke, patch moves the target)

No single platform covers all five steps. The closest is Refrag (steps 2-4 with some 1 and 5), but its paywall and in-game-only format limit accessibility.

## What Content Selection Reveals

**A platform that only shows T-side execute smokes** is making a statement: "the hardest problem in CS2 is getting the bomb down." This is the perspective of a Silver-to-MG player who loses most rounds because the T-side can't take a site.

**A platform that emphasizes retake utility** (CT-side smokes for post-plant) is making a different statement: "you're going to lose sites — what matters is getting them back." This is the perspective of a higher-skilled player who understands that retakes are where rounds are actually decided at competitive levels.

**A platform that catalogs one-way smokes** is making yet another statement: "individual advantage matters more than team coordination." One-way smokes are solo-queue tools — they give one player an information advantage without requiring team buy-in.

**A platform that teaches smoke+flash+molly combos** (like CSNADES.gg's Solo Combinations or Smoke Baron's Combos) is saying: "utility sequences are more valuable than individual grenades." This is the most tactically mature position — it models the reality that a single smoke in isolation rarely wins a round, but a smoke-flash-molly sequence that clears, blinds, and blocks simultaneously creates an overwhelming advantage.

---

# Part 4 — The Fundamental Logic of CS2 Utility

## 4.1 Taxonomy of Utility Purpose

Every grenade in CS2 serves one or more of these tactical purposes. Understanding this taxonomy is the foundation of adaptive utility usage.

### Information Denial (Smokes)

Smoke grenades cancel sightlines. But "cancel sightlines" is too simple — the tactical purpose varies by context:

- **Crossing smoke:** Blocks a sightline so players can cross open ground without being picked. Example: Dust 2 mid-doors smoke lets Ts cross from T-spawn to lower tunnels without the CT AWPer in mid-doors picking them. The smoke doesn't help take a site — it enables movement.
- **Execute smoke:** Blocks a defender's angle during a site take. Example: Mirage A-site — CT/jungle/stairs smokes isolate the remaining defenders into individual angles that the T-side can overwhelm with numbers. The purpose is to break a coordinated crossfire into independent 1v1 fights.
- **Retake smoke:** Blocks the post-plant positions so CTs can re-enter a site. The asymmetry: T-side execute smokes block defenders; CT-side retake smokes block attackers. Same physical location, different tactical purpose, different throw direction.
- **Rotation-denial smoke:** Blocks a rotation path to buy time. Example: Inferno CT-spawn smoke from banana — blocks CT rotation from A to B, giving T-side extra seconds before reinforcements arrive.
- **Information-gathering smoke:** Thrown to determine whether a position is occupied. If the smoke is shot through (creating visible bullet holes in CS2's volumetric system), the position is held. If not, it may be safe to push.

### Area Denial (Molotovs/Incendiaries)

Molotovs force movement. Their purpose is always about controlling WHERE the opponent can be:

- **Position-clearing molly:** Thrown at a common anchor position to force the defender off it. Example: Inferno — mollying coffins on banana forces the AWPer to reposition, opening banana for the T push. The molly doesn't kill (usually) — it creates a 7-second window where that position is untenable.
- **Rush-delay molly:** CT-side incendiary thrown at a chokepoint to slow a T rush. Example: Inferno — incendiary at the top of banana stops a B rush for 7 seconds, buying time for rotation.
- **Post-plant denial molly:** Thrown at the bomb after plant to prevent defuse. This is the highest-leverage molly in the game — 7 seconds of defuse denial costs $400 and can single-handedly win a round.
- **Economic damage molly:** In anti-eco or force rounds, mollies on rush paths deal unavoidable damage to under-armored opponents, turning $400 into 50+ HP of chip damage across multiple enemies.

### Vision Manipulation (Flashbangs)

Flashbangs buy 1-3 seconds of opponent inability. The purpose is always to enable a specific action:

- **Entry flash (pop-flash):** Detonates within 0.1 seconds of leaving cover, giving the defender no time to turn away. Enables a teammate to peek and take a fight against a blinded opponent. The art is in the timing — the flash must pop at the exact moment the teammate peeks.
- **Support flash:** Thrown by a second player to enable a teammate's peek. Slightly slower than a self-flash but allows the peeker to be fully ready.
- **Retake flash:** Thrown during a retake to blind post-plant holders. Often bounced off walls or ceilings to reach positions the flasher can't see.
- **Re-flash:** Thrown to reset a stalled hold. When neither side is pushing, a flash disrupts the equilibrium and creates a timing window.

### Damage Dealing (HE Grenades)

HE grenades deal ~57 damage on armored targets at point-blank (up to ~100 unarmored), with falloff by distance. Their purpose is:

- **Chip damage:** Reducing an opponent's HP before a gunfight. A player at 43 HP after an HE dies to a single body shot from an AK-47 instead of requiring a headshot.
- **Smoke clearing (CS2 signature move):** An HE detonating inside or adjacent to a smoke creates a 2-3 second visibility window. This is the signature CS2 maneuver that didn't exist in CS:GO — it adds a new tactical layer where smokes are no longer guaranteed 18-second blockers.
- **Stack damage:** Coordinated HE grenades from multiple players thrown at the same position can deal 100+ damage, effectively killing a defender without ever seeing them. Common on eco rounds.
- **Economy damage:** At $300, an HE that forces an opponent to rebuy armor ($650) or die is economically efficient.

### Timing Manipulation

All utility manipulates timing, but some uses are specifically about time:

- **Buying time:** CT-side utility (smokes, mollies) delays T pushes, giving time for rotations. A smoke + molly sequence on banana gives CTs ~25 seconds (18s smoke + 7s molly) of denial on a single chokepoint.
- **Creating timing windows:** Flashbangs create 1-3 second windows where an action (peek, defuse, plant) can be performed unopposed. The precision of the timing window is what separates useful utility from wasted utility.
- **Tempo control:** Throwing utility at the start of a round signals intent (real or fake). Not throwing utility signals a slow default or an eco. Opponents read utility timing to predict strategy — and smart players manipulate this reading with fake utility.

### Forced Rotations and Fakes

Utility thrown at one site to draw defenders away from the actual target:

- **Fake execute:** Throw 2-3 smokes and a molly at A site, then attack B. If defenders rotate toward the utility, B is undermanned. The cost is $900-1200 in wasted utility — but if it creates a 5v3 at B, the math works.
- **Partial fake:** Throw one smoke mid-round to create uncertainty. The defender doesn't know if it's a fake or the start of a real execute, and must decide whether to rotate or hold.

### Distraction and Deception (Decoys)

Decoys ($50) mimic the equipped weapon's firing sound for 10 seconds, ending with a small explosion dealing 1-5 HP:

- **Fake presence:** Throw decoy at one position while moving to another. The sound draws attention.
- **Fake firepower:** A decoy mimicking an AWP sound suggests an AWPer is holding an angle, potentially changing the opponent's approach.
- **Double decoy rush:** Multiple decoys at a site simulate a multi-player rush.
- **Post-plant deception:** Decoy behind a box simulates a player holding an angle.
- **Status:** The most underused utility in CS2. At $50, the cost-to-information ratio is theoretically excellent, but the meta hasn't evolved to make consistent use of decoys at most skill levels. At the pro level, decoys are occasionally deployed during eco rounds to simulate a full buy's soundscape — five decoys mimicking AK-47 fire at A site costs $250 total and can force a CT rotation that wouldn't happen against a silent eco push. The December 2024 community analysis by CS2 Pulse noted increasing decoy usage in anti-eco rounds at FACEIT Level 9+, suggesting a slow meta shift toward incorporating them.

## 4.2 The Economics of Utility

### Grenade Costs

| Grenade | Cost | Max Carry |
|---|---|---|
| Smoke | $300 | 1 |
| Flashbang | $200 | 2 |
| HE Grenade | $300 | 1 |
| Molotov (T) | $400 | 1 |
| Incendiary (CT) | $600 | 1 |
| Decoy | $50 | 1 |

**Full utility cost:** T-side: $1,200 (smoke + 2 flash + HE + molly). CT-side: $1,400 (+$200 for incendiary vs molly).

### The Full Buy Budget

A complete T-side full buy: AK-47 ($2,700) + Kevlar+Helmet ($1,000) + Full Utility ($1,200) = **$4,900**. A CT-side full buy: M4A4 ($3,100) or M4A1-S ($2,900) + Kevlar+Helmet ($1,000) + Full Utility ($1,400) = **$5,500-5,700**.

### When Utility Outvalues Weapons

The strongest insight in CS2 economy is that a team with slightly weaker guns but better utility frequently wins. A half-buy with full utility (Galil/FAMAS + full nades) on a map-control-dependent map like Inferno or Nuke can outperform a full rifle buy with zero utility. The reason: without smokes, the T-side can't execute on any site safely, and without mollies, the CT-side can't delay pushes — rendering their rifles irrelevant because they're fighting from disadvantaged positions.

Pro teams have internalized this: you'll see teams buy full utility and a FAMAS rather than an M4A1-S with no nades. The utility IS the weapon.

### The July 2025 Economy Update

Valve introduced a shared kill reward for CTs in July 2025, subtly shifting the economic balance. CTs can now bounce back faster from lost rounds, which means more full-buy rounds with full utility on the defensive side. This has increased the overall utility density in professional matches.

## 4.3 CS:GO to CS2 — What Changed and What Broke

### The Volumetric Smoke Revolution

CS2 replaced CS:GO's 2D sprite-based smoke particles with true 3D volumetric objects:

- **Environmental interaction:** Smokes fill enclosed spaces, hug geometry, crawl around corners in narrow corridors. On Nuke, smoke fills entire stairwells. On Inferno, smoke crawls through banana's tight geometry.
- **Client consistency:** Every player sees the exact same smoke shape. In CS:GO, different graphics settings and system specs could create slightly different smoke renders, enabling one-way smokes where one player could see through and the other couldn't. CS2 eliminated this. One-way smokes are functionally dead — with the caveat that creative players (like fl0m) continue finding edge cases using HE-smoke combinations to create apertures.
- **Bullet carving:** Spraying through smoke opens temporary head-sized visibility holes that refill in ~1 second. This means aggressive play through smokes is riskier in CS2 — a defender who sprays toward sound will briefly see the pusher.
- **HE clearing:** An HE detonating inside/adjacent to a smoke creates a massive gap for 2-3 seconds before re-expansion. This was made reliable and consistent by the October 28, 2024 patch. HE-into-smoke is the signature CS2 maneuver.
- **Fire interaction:** Smoke landing on a molotov extinguishes the flame on contact. Vision block remains for the full 18 seconds. This creates a defensive option in CS2 that didn't exist in CS:GO — you can smoke your own molotov to simultaneously deny vision and deny area.
- **Smoke duration:** 18 seconds, unchanged from CS:GO.

### What Broke

Approximately 70% of CS:GO smoke lineups needed rebuilding for CS2. Specific categories:

- **Pixel-perfect "antenna" lineups:** CS:GO lineups that required aligning crosshair with a specific pixel on an antenna, crack, or texture detail frequently miss in CS2 due to subtle geometry and rendering changes. Landmark-based lineups (align with the edge of a building, the corner of a wall) port better.
- **One-way smokes:** Almost entirely dead. The volumetric system renders identically for all players.
- **Tickrate-dependent lineups:** In CS:GO, many lineups landed differently on 64-tick vs 128-tick servers. CS2's sub-tick system eliminates this entirely — all lineups land identically regardless of server configuration.
- **Map-specific changes:** Individual maps received geometry changes that invalidated specific lineups. Mirage T-spawn antenna smoke, Inferno T-ramp banana combos, Dust 2 certain T-spawn smokes, Overpass deep-monster connector smoke all required rebuilding.

### What Improved

- **Sub-tick consistency:** Every lineup works the same in practice mode as in competitive. This is the single biggest quality-of-life improvement for utility learners — you never waste time learning a lineup that only works on community servers.
- **Molotov physics:** Dynamic flame spread using Half-Life: Alyx liquid shader. Flames flow downhill, pool, and crawl up slopes. More realistic but also more complex — molly lineups that relied on CS:GO's simpler flame model (flat spread) may behave differently.
- **Grenade preview:** `cl_grenadepreview 1` shows the trajectory arc BEFORE throwing, allowing practice and experimentation without wasting a grenade.
- **Skybox removals:** Some maps had skybox changes enabling new throw arcs not possible in CS:GO.

### Patches That Keep Shifting Lineups

CS2's utility meta is a moving target:
- **April 2024:** Slope physics update broke many molly lineups.
- **October 28, 2024:** HE smoke-clearing made reliable and consistent.
- **January 2024:** Silent HE-damage bug fixed.
- **July 2025:** Economy update (shared CT kill rewards) increased utility density.
- **January 2026:** Smoke re-tune.
- **April 2026:** Cache returned to map pool (all-new lineups needed).

**Implication:** Any utility resource dated before a major physics patch may contain outdated lineups. Always check the date of the guide against the CS2 patch timeline.

## 4.4 Utility Across Skill Levels

### Silver / Gold Nova (0-5K Premier Rating)

Utility usage is minimal or nonexistent. Players buy grenades but forget to use them (Leetify's "unused utility upon death" metric is highest at these ranks). When utility is thrown, it lacks purpose — smokes land in random locations, flashes blind teammates more than enemies, mollies are thrown reactively rather than proactively.

**What changes everything at this level:** Learning literally 3 smokes per map (one for each site plus one for mid) creates an outsized advantage because opponents have zero utility discipline.

### Master Guardian / Distinguished Master Guardian (5K-12K Premier)

Players begin using utility intentionally but inconsistently. They know a few lineups from YouTube videos but lack the judgment to deploy them correctly — throwing an A-execute smoke when only 2 players are committed to A, or flashing before anyone is ready to peek.

**What changes at this level:** Timing coordination. Learning to throw utility at the right MOMENT matters more than learning new lineups. A perfectly-timed pop-flash for a teammate's peek wins more rounds than knowing 50 smokes.

### Supreme / Global Elite / FACEIT 6-8 (12K-20K Premier)

Decision-making and utility usage become critical. Every round feels tactical. Players can't rely on aim alone. Utility is used purposefully — execute smokes land correctly, mollies clear positions, flashes support peeks. But utility is still largely individual rather than coordinated.

**What changes at this level:** Adaptive utility. Instead of throwing the same smokes every round, players begin reading the opponent's setup and adjusting their utility accordingly. If the AWPer keeps holding window on Mirage, maybe you smoke window early. If the AWPer moves to jungle, smoke jungle instead. This is the transition from memorization to understanding.

### FACEIT 9-10 / Semi-pro (20K+ Premier)

Utility becomes coordinated. Two-three players throw utility together with rehearsed timing. Executes involve simultaneous smokes from different positions. Post-plant utility is planned before the round starts. Teams develop utility "protocols" — agreed-upon utility sequences for specific calls.

**What changes at this level:** Counter-utility. Players begin anticipating the opponent's utility and countering it — throwing an HE into the expected smoke to clear it, molly-ing the expected flash position to prevent the pop-flash, timing pushes for the exact moment between an opponent's smoke fading and their next smoke being available.

### Tier-1 Professional

Utility is the round. The weapons are just how you cash in on the openings the utility creates. Tier-1 teams (NaVi, FaZe, Vitality, Spirit, G2) plan every grenade in every default and every execute. The IGL allocates utility per player per round. Every grenade has a specific purpose, and wasting a grenade is treated as seriously as missing a crucial shot.

**What distinguishes pro utility:**
- **Utility density:** Multiple grenades layered on the same position simultaneously. A smoke + flash + molly + HE hitting one area in a 2-second window is overwhelming even for a prepared defender.
- **Utility trading:** If one team throws utility to take map control, the other team counters with their own utility. The team that "wins" the utility trade (achieves more with fewer grenades) gains the advantage.
- **Utility economy:** Saving grenades for later in the round rather than throwing everything in the first 30 seconds. A smoke held until 0:45 for a late B rotation is worth more than a smoke thrown at 1:45 that the CTs don't need to respect.
- **Anti-stratting:** Adjusting utility based on scouted opponent tendencies. "They always smoke banana at the start — throw an HE into it to clear it and push through."

## 4.5 The Asymmetric Logic of Map Control Through Utility

The same physical location on a map requires different utility from each side because the tactical context is fundamentally different:

### Why the Same Spot Gets Different Smokes

**Mirage — A-site CT/Jungle/Stairs positions:**
- **T-side:** Smokes CT, jungle, and stairs to block CT crossfires during an execute. Purpose: isolate defenders into individual 1v1 fights that the 5-player T-side can overwhelm with numbers.
- **CT-side (retake):** Smokes the planted bomb or T-held positions (ramp, palace) to block post-plant angles. Purpose: deny the T's post-plant crossfires so CTs can retake.

**The asymmetry:** T-side smokes block existing defenders. CT-side smokes block attackers who have already taken control. The physical smoke lands in similar areas but faces opposite directions because the threat vector is reversed.

**Inferno — Banana:**
- **T-side:** Smokes coffins (the AWP angle) and CT-spawn connector to deny the CT early information and create a safe push path up banana. Purpose: take banana control as the foundation for a B-site execute or a split.
- **CT-side:** Smokes the bottom of banana to delay a T rush, buying time for rotation from A. Alternatively, mollies the top of banana to deny the initial T push. Purpose: maintain banana control as long as possible without committing a second player.

**The asymmetry:** T-side utility is about TAKING territory (offensive). CT-side utility is about HOLDING territory (defensive). The same corridor requires opposite utility strategies because one side needs to move through it and the other needs to prevent that movement.

### The Rotation Equation

Maps are designed with asymmetric rotation times. CTs generally have shorter rotation paths (they're defending a smaller area) while Ts control tempo by choosing when and where to commit. Utility mediates this asymmetry:

- **T-side smokes block rotations:** A smoke in CT-spawn on Dust 2 adds 3-5 seconds to the CT rotation from B to A. Those seconds are the difference between a successful execute and a retake.
- **CT-side utility buys rotation time:** A CT smoke + molly sequence on banana buys ~25 seconds. If the CTs rotate from A to B in 8 seconds, that's 25 seconds of delay + 8 seconds of rotation = 33 seconds of safety on B site. In a 1:55 round, that's 28% of the round clock consumed by two grenades.

## 4.6 Map-by-Map Canonical Utility

### Current Active Duty Pool (May 2026)

The active duty maps for Premier Season 4 are: **Anubis, Ancient, Dust II, Inferno, Mirage, Nuke, Overpass.** Cache was added to the broader competitive pool on April 28, 2026 (fully rebuilt for Source 2). Vertigo and Train rotate in and out.

---

### Dust 2

**T-Side Execute — A Site:**
- **A Cross smoke (from long):** Shields the advance from CT-spawn toward A site. Without it, players crossing from long to site are exposed to CT-spawn, A-short, and rotating B players — three simultaneous angles. The smoke reduces this to zero.
- **CT-spawn smoke:** Blocks CT rotations from B through CT-spawn. Adds 3-5 seconds to rotation time.
- **Short/catwalk smoke:** Blocks the short connector so the A-site take doesn't get flanked.
- **Entry flash (long doors):** Pop-flash through long doors to blind the long-holding defender. Must detonate within 0.1s of the entry fragger's peek.

**T-Side Execute — B Site:**
- **B doors smoke (from upper tunnels):** Blocks the window/doors angle. CTs holding window can pick any player exiting upper tunnels; smoking doors removes this entirely.
- **Back-platform molly:** Forces the defender off the elevated back-site position.

**T-Side Mid Control:**
- **Mid-doors smoke:** The single most important smoke on Dust 2. CS2's volumetric system changed this — the old Xbox smoke is no longer necessary because a simpler smoke thrown into mid-doors blooms to cover the entire gap. This blocks the CT AWPer's sightline from mid-doors to T-spawn, enabling safe passage to lower tunnels or B.
- **Why mid matters:** Mid control on Dust 2 gives T-side access to both sites through B tunnels and short/catwalk. Without a mid-doors smoke, the CT AWPer controls the entire center of the map with a single angle.

**CT-Side:**
- **Long corner smoke (from CT-spawn):** Delays the T long push, buying time for rotation or a counterpeek.
- **Mid-doors smoke (from CT side):** CTs can also smoke mid-doors to deny T information about CT positions. Same location, opposite purpose — CTs want to hide their setup, Ts want to cross safely.
- **B doors one-way/information smoke:** [CS2 caveat: traditional one-ways are dead, but CT-side smokes in B tunnel still serve the information-denial purpose]

---

### Mirage

**T-Side Execute — A Site:**
The canonical Mirage A execute is the most drilled utility sequence in all of Counter-Strike:
- **CT-spawn smoke:** Blocks the CT-spawn angle that covers the entire A site from an elevated position. Without this, a CT in spawn can shoot at anyone on A site with near-impunity.
- **Jungle smoke:** Blocks the connector/jungle position that provides a crossfire angle to the site. This isolates the A-anchor from help.
- **Stairs smoke:** Blocks the stairs/firebox angle. Combined with the jungle smoke, this means the only remaining CT on A site has to fight from one of a small number of predictable positions.
- **Combined effect:** Three smokes split the A site into an isolated killbox. The remaining defenders can't crossfire, can't fall back to each other, and can't see reinforcements arriving. This is the purest example of utility as fight-isolation — the smokes don't deal damage, they restructure the engagement geometry.

**T-Side Execute — B Site:**
- **Market/apartments smoke:** Blocks the rotation path from market window to B site.
- **Short smoke:** Blocks the B-short angle.
- **Bench/site mollies:** Clear common anchor positions on B site.

**T-Side Mid Control:**
- **Window smoke (from T-spawn):** Blocks the CT AWPer holding window, which controls the entire mid area. After CS2 updates changed the smoke physics, the old T-spawn antenna lineup no longer works — players use new reference points (left side of trash can, aim at right door frame aligned with carpet).
- **Connector smoke:** Blocks the connector between mid and A-site, preventing CT flanks through connector during a mid take.

**CT-Side Retakes:**
- CTs smoke the bomb plant position or T-held angles (ramp, palace) to deny post-plant crossfires.
- Retake mollies flush T-side players from behind boxes and default plant spots.

---

### Inferno

**The Banana Equation:**
Inferno rounds are decided on banana before the clock hits 1:30. The team that controls banana controls B site. Banana is the most utility-intensive corridor in all of CS2.

**T-Side Banana Control:**
- **Coffins smoke:** The AWP angle at coffins ends T-side banana pushes before they start. An AWPer here has near-zero counterplay from the T side. Smoking coffins early turns the fight into a numbers advantage.
- **Car/sandbags molly:** Forces the close-range CT holding the top of banana off their position.
- **Deep banana smoke:** Blocks CT vision into the lower half of banana, enabling Ts to establish presence.
- **The layer principle:** T-side banana control requires layered utility — first a smoke to block vision, then a molly to clear positions, then a flash to support the push. Single-grenade attempts at banana control fail because CTs can fire through/around individual smokes.

**T-Side B Execute:**
- **CT-spawn smoke (from banana):** Blocks CT rotation from A to B.
- **Site smokes/mollies:** Clear the remaining B-site defenders.

**T-Side A Execute:**
- **Arch smoke:** Blocks the arch-side approach to A site.
- **Library/pit mollies:** Clear common positions.
- **Apartments flash:** Pop-flash through apartments for the entry.

**CT-Side:**
- **Top banana smoke + incendiary:** The CT's primary tool for banana denial. An incendiary at the top of banana stops a rush for 7 seconds. A smoke extends this. Together, they buy 25+ seconds — enough to rotate reinforcements from A.
- **Banana retake utility:** If Ts take banana, CTs use utility to retake it from the CT-spawn side — smokes to block vision, flashes to support re-entry, mollies to clear T positions in banana.

---

### Nuke

**Unique challenge: Verticality.** Nuke is the only competitive map where bomb sites are directly above and below each other. Sound cues are critical — CTs hear every ramp push through audio, and rotations from A (upper) to B (lower) take only 5 seconds via the inside route.

**T-Side Outside Control (the heart of Nuke):**
- If Ts control outside, CTs must rotate, creating gaps elsewhere.
- **T-Red / Garage / Mini smokes:** A wall of two smokes from T-Red to Secret blocks CT sightlines from A-site roof to the outside area. This is the foundation of every outside-based strategy.
- **Garage smoke:** Enables scaling to Mini for an A-site split.
- **Why outside matters:** Outside is the only area on Nuke where Ts can establish meaningful map control without committing to a site. Losing outside means the CTs don't know if A or B is the target — it's information denial at the macro level.

**T-Side A (Upper) Execute:**
- **Heaven smoke (from squeaky or hut):** Blocks the CT AWPer in heaven, which otherwise controls the entire A site.
- **Main/Mini smokes:** Block approach angles to prevent CT crossfires.

**T-Side B (Lower) Execute:**
- **Window and garage vision smokes:** B site attacks are slower due to enclosed tunnels.
- **Toxic, dark, and behind-boxes mollies:** Clear CT positions in the tight B site.

**CT-Side:**
- **Outside denial:** Smokes and mollies thrown from CT-side to prevent T outside control.
- **Ramp denial:** Incendiaries and smokes to slow T ramp pushes.
- **Sound-based utility timing:** CTs use audio cues from ramp and vents to time their utility — hearing footsteps on ramp triggers a flash or molly.

---

### Ancient

**The most T-unfriendly A site in competitive CS2.** A deep angle to CT that AWPers exploit, tight approaches with multiple crossfire positions.

**T-Side B Execute (the T-favored option):**
- **Three B-lane smokes from one corner:** All three canonical B-site smokes are thrown from the same corner (before the B-lane doors on T side). This is remarkable — the same throw position produces three different landing spots by adjusting aim. The smokes lock out every CT angle on B.
- **Why B is T-favored:** The geometry allows a complete site lockdown with coordinated utility from a single safe position.

**T-Side A Execute:**
- Significantly harder. Requires smoking the deep CT angle, blocking heaven, and clearing multiple tight positions simultaneously. Teams that can take Ancient A consistently have a major advantage.

**T-Side Mid Control:**
- **Mid smoke:** Splits the CT defensive setup. Two CTs sharing mid control become one CT on each side who cannot trade or fall back together. Without it, both CTs rotate freely to B and arrive before the bomb is planted.
- **Why mid is critical on Ancient:** Mid is the multiplier — it doesn't directly threaten a site, but it forces the CTs to defend in isolation rather than as a coordinated unit.

---

### Anubis

**Status:** Returned to Active Duty for Premier Season 4 on January 22, 2026. The most T-sided map in the active pool due to complex connectors and water control.

**Unique challenges:** Different hiding areas, various entrances and elevations, and narrow pathways alternating with open areas. Deep knowledge of utility is essential — without it, attacking sides lose most gunfights by default.

**T-Side A Execute:**
- **Canal/connector smokes:** Block the mid-connector sightlines that CTs use to read the T approach. Anubis's A approach is long and exposed — without connector smokes, CTs see the commitment early and rotate.
- **Site entry mollies:** The narrow A-approach corridors mean mollies fill the entire width, making them extremely effective at flushing CT anchors.
- **Heaven/elevated smokes:** Anubis has elevated CT positions above A site that require smoke throws with unusual vertical arcs.

**T-Side B Execute:**
- **Water control utility:** Water is the connector between sites and the primary CT rotation route. Smoking or mollying water denies CTs their fastest rotation path, adding 5-8 seconds to rotation time.
- **B approach smokes:** The B lane is narrow, making well-placed smokes nearly impossible for CTs to play around. The geometry favors T-side execute utility because the volumetric smoke system fills narrow corridors completely.

**CT-Side:**
- **Water defense:** CTs throw incendiaries into water to deny T flanks and mid-round rotations.
- **Narrow-corridor mollies:** The tight pathways on Anubis make CT incendiaries exceptionally powerful — flames fill the entire width, creating impassable barriers for the full 7-second duration.
- **Elevation-based utility:** CT positions above site allow for unique downward-angle flashes and HEs that T-side players struggle to counter.

**Why Anubis is T-sided:** The map's connector system gives Ts multiple approach angles that CTs can't all hold simultaneously. Utility exacerbates this — Ts can isolate any single CT with focused utility while the connector layout prevents rapid CT reinforcement.

---

### Overpass

**T-Side A Execute:**
- **Front Bathrooms smoke:** One of the most dangerous AWP spots on Overpass. This smoke completely removes the AWPer's ability to catch players moving from Fountain or Divider.
- **Bank smoke:** Blocks CT rotations from B, giving partial site control.
- **Dumpster/Stairs smoke:** Covers CT stairs. Combined with the Bank smoke, this blocks key rotation entry points.

**T-Side B Execute:**
- **Bridge smoke:** Allows safe push from Short to B site.
- **Heaven smoke:** Protects from elevated AWPer.
- **Pillar smoke:** Blocks defenders at Barrels or Pillar.
- **Monster smoke:** Blocks T-side rush into Monster tunnel.
- **Combination:** Molly on barrels + smoke covering Heaven + Back site smoke enables rapid site take.

**CT-Side:**
- Overpass is statistically one of the safest picks for defensive-minded teams. CT utility focuses on holding established positions rather than aggressive plays.
- **Connector defense:** CT smokes and mollies at the connector between A and B deny T mid-map control. The connector is the pivot point of Overpass — losing it means losing the ability to rotate between sites.
- **Bathroom denial:** CT incendiary thrown into front bathrooms prevents T-side from establishing the AWP position that otherwise dominates the A approach. At $600, this incendiary denies a $4,750 AWP angle — the economics are overwhelmingly favorable.
- **B-site retake utility:** Overpass B-site retakes are among the hardest in CS2 because the T post-plant positions have strong cover. CT retake utility must include 2+ smokes (bridge, pillar) and at least 1 molly (bomb plant area) to have any chance of success.

---

### Vertigo

**Unique challenge: Multi-level verticality** with unique sound cues and tight spaces.

**T-Side A Execute:**
- **Top Ramp (Yellow) smoke:** Blocks the common CT position at the top of A ramp. Thrown from the corner on the left side, aiming at the gap of the crane close to the yellow box, standing jump throw.
- **Back Site smoke:** Enables push into A site. Thrown from an approach position, aimed at the left of the 2nd bolt, standing jump throw.
- **Ramp smoke (from Elevators):** CT defensive smoke for A ramp. Lined up from the wall in Elevators, facing the ceiling, running forward with left-click released when crosshair reaches the far edge of the light.

**T-Side B Execute:**
- **Generator smokes:** Two smokes covering either side of Generator, the key CT position on B site.
- The tight B-site approach means utility must be precise — even small inaccuracies leave dangerous gaps.

**CT-Side:**
- **A Ramp smoke/incendiary:** The primary CT stalling tool. Thrown from Elevators to delay the T ramp push. Because Vertigo's A site has only one primary approach angle (the ramp), a single well-placed incendiary buys as much time as the dual-corridor setups on other maps.
- **B stairs denial:** CT mollies on the B staircase prevent fast B rushes. The enclosed stairwell means flames fill the entire width.
- **Sound-based utility deployment:** Vertigo's verticality creates unique sound propagation. CTs above can hear T movement below and time utility to meet pushes at the exact moment Ts commit. This sound-utility interaction is more pronounced on Vertigo than any other competitive map.

**Why Vertigo is unique for utility:** The multi-level geometry means some smokes must block VERTICAL sightlines (CTs looking down from above, Ts looking up through gaps). Most utility guides default to horizontal sightline blocking — Vertigo forces players to think three-dimensionally about utility placement.

---

### Cache (Returned April 28, 2026)

**Status:** Fully rebuilt for Source 2. All-new lineup meta (no CS:GO lineups carry over to the rebuild).

**Key concepts:**
- **Mid control is everything.** Losing mid means losing the ability to rotate and losing information on both sites simultaneously.
- **T-Ramp smoke (CT priority #1):** Blocks T-side vision up the ramp, letting the mid player hold safely without getting picked from elevation.
- **Connector smoke:** The most important smoke on the entire map. The connector is almost always held by a CT or AWPer who can freely pick anyone moving through mid.
- **Heaven smoke (A execute):** Removes the most dangerous angle on A site.
- **CT box and CT tunnel smokes (B execute):** Remove the most dangerous B-site angles.

---

# Part 5 — Synthesis and Recommendations

## 5.0 The Evolution of Pro Utility: Eras and Innovators

Understanding how professional utility philosophy evolved illuminates why the current learning ecosystem looks the way it does. Each era produced insights that trickled down to content creators and platforms.

### The Astralis Era (2018-2019): Grenade Scripts

Astralis under gla1ve established the template that every subsequent team inherited. From DreamHack Marseille 2018 onward, every Astralis round had a precise grenade script: which player threw what, when, from where. Their slow-default approach — spending the first 40 seconds on information-gathering with minimal utility, then committing everything in a coordinated burst — demonstrated that utility discipline could beat raw firepower. Astralis won 4 Majors with this approach.

**Legacy for the learning ecosystem:** The concept of "scripted utility" is why platforms like Refrag and yprac organize lineups sequentially (lineup #1, #2, #3 in order). The script model assumes players learn utility as rehearsed sequences, not improvised decisions.

### The Liquid Era (2019): Aggressive Smoke Pushing

Team Liquid under nitr0 and adreN pioneered aggressive play THROUGH smokes — the "Stewie2K Smoke Criminal" concept. Rather than respecting smokes as impassable barriers, Liquid treated them as cover for unexpected aggression. This broke the Astralis model's assumption that a deployed smoke bought guaranteed denial.

**Legacy for the learning ecosystem:** This is why advanced guides now include "playing through smokes" as a tactic, and why understanding smoke mechanics (bullet carving, HE clearing) matters beyond just knowing where to throw them.

### The NaVi/s1mple Era (2021): AWPer-Centric Utility

NaVi built their entire utility architecture around giving s1mple clean AWP angles. The team's utility existed to create isolated duels where s1mple's mechanical superiority was overwhelming. Every smoke, flash, and molly served one purpose: make s1mple's next shot a 1v1 from an advantageous angle.

**Legacy for the learning ecosystem:** This is why platforms like Refrag emphasize the AWPer's utility needs as a special case — the AWPer carries light utility while the team's utility is deployed FOR the AWPer.

### The FaZe/karrigan Era (2022): Role-Fluid Allocation

karrigan's FaZe demonstrated that utility assignments don't need to be rigid. FaZe rotated the anchor/lurker assignment round-to-round, meaning different players threw different utility in each round. This flexibility forced opponents to re-read every utility setup mid-series, preventing effective anti-stratting.

**Legacy for the learning ecosystem:** This is the conceptual basis for why understanding principles matters more than memorizing assignments — in a role-fluid system, any player might need to throw any smoke.

### The Vitality/apEX Era (2023-2025): Hybrid AWPer Model + Flash Dominance

apEX built Vitality's utility around ZywOo's hybrid rifler-AWPer role. Flash assists increased 25% over analyst commentary baselines. apEX himself leads the 2025 pro utility damage rankings with 218.6 damage per 24 rounds — remarkable for an IGL, who traditionally focuses on calling rather than personal grenading. This demonstrated that IGLs who participate in utility execution (rather than only directing it) create stronger overall utility density.

### The Spirit/chopper Era (2024-2025): Entry Support Through Utility

Spirit under chopper built utility sequences specifically to give donk the cleanest possible early-round entries. When every opponent began anti-stratting donk's pathways frame-by-frame, Spirit adapted by slowing rounds, delaying utility sequences, and mixing in lurk plays. This is the cutting edge of adaptive utility — responding to anti-stratting in real-time rather than running the same scripts.

### The Current Meta: Structured Aggression

The 2025-2026 meta synthesizes all previous eras: fast, mechanically aggressive rounds built around a star rifler, supported by structured utility that creates clean 1v1 entries, with enough variation to prevent effective anti-stratting. Utility-heavy slow-execute teams win more rounds than aggressive tempo teams right now, and pro teams increasingly trade weapon upgrades for more utility — half-buys with full utility often outperform full-buys with minimal grenades.

## 5.1 Which Platforms Teach Thinking vs. Memorization?

**Teach thinking:**
- Elmapuddy (pro-level tactical reasoning)
- voo/Gosu Academy (strategic decision-making framework)
- n0thing (pro-player perspective on why utility decisions are made)
- Refrag Utility Hub (explains "how, when, and why" per nade)
- CS2 Utility Encyclopedia (this project — decision frameworks, counter-utility theory, IGL frameworks)

**Teach memorization:**
- CS2UTIL, CSNADES.gg, lineups.gg, Smoke Baron (lineup reference databases)
- yprac Hub (drill-based guided practice)
- Most YouTube "every smoke on [map]" videos

**Blend both:**
- NadeKing/CS2Tricks (entertainment wrapper around practical lineups with some tactical context)
- CSDB.gg (reference database with difficulty ratings and side context)
- Refrag Bootcamp (structured curriculum combining concepts and drills)
- Switchblade Gaming and BLAST guides (curated "essential" lineups with tactical justification for each selection)

## 5.2 Which Oversimplify in Ways That Hurt Players Long-Term?

**Potentially harmful oversimplifications:**
- Platforms that show only T-side execute smokes create players who can take sites but can't retake them, can't hold as CT, and have no utility plan for eco or force rounds.
- YouTube "50 smokes on Mirage" videos that don't explain when or why to use each smoke create players who throw utility because they memorized it, not because the round demands it. This leads to wasted utility in the wrong context.
- Platforms that don't differentiate between solo-queue utility and team utility create false expectations — a coordinated 3-smoke execute doesn't work when your random teammates don't know the other two smokes.
- One-way smoke compilations for CS2 (still produced by some creators despite the volumetric system killing most one-ways) teach techniques that will fail in practice, building false confidence.

## 5.3 Which Serve Which Skill Levels Well?

| Skill Level | Best Resources |
|---|---|
| Complete beginner (Silver-Gold Nova) | WarOwl (basics), CS2UTIL Easy lineups, yprac guided mode, Mirage/Dust2 only |
| Improving player (MG-DMG) | NadeKing (motivation + practical lineups), CSNADES.gg (video tutorials), Smoke Baron (mobile reference), 3-5 lineups per site per map |
| Competitive player (LE-Global/FACEIT 7-8) | voo/Gosu Academy (strategic thinking), Elmapuddy (pro analysis), Refrag (in-game drills), Leetify (self-diagnosis) |
| Aspiring pro (FACEIT 9-10+) | Elmapuddy, n0thing, HLTV demo review, Refrag Academy, team-specific utility protocols, counter-utility theory |

## 5.4 The Overall State of CS2 Utility Learning Resources (May 2026)

**The good:** The ecosystem is extensive, mostly free, and covers the basics well. Between CS2UTIL, CSNADES.gg, yprac, and NadeKing, a motivated player can learn every canonical lineup on every competitive map without spending a dollar. The tools exist.

**The concerning:** The ecosystem is fragmented and lacks integration. No single platform covers the full learning loop (diagnose weakness → understand principle → learn lineup → drill → apply → adapt). Players must stitch together 3-4 platforms to cover the full path. The "understanding" layer (why utility exists, when to use it, how to adapt it) is served only by YouTube creators and paid coaching — there's no free, structured, interactive resource that teaches utility decision-making.

**The missing:**
- **Multi-player execute modeling:** No platform models coordinated utility sequences across multiple players. Every resource treats utility as an individual activity, but CS2 is a team game.
- **Post-plant utility as a first-class category:** No platform organizes post-plant utility separately, despite it being arguably the highest-leverage utility in the game (a post-plant molly on the bomb can single-handedly win a round).
- **Round-type-specific utility presets:** No platform teaches what to buy and throw on eco rounds vs. force buys vs. full buys vs. anti-eco rounds. The economy-utility interaction is documented in theory but not in practice tools.
- **Role-based utility views:** No platform shows "what should the entry fragger carry?" vs. "what should the support player carry?" Utility allocation by team role is a pro-level concept that no educational resource addresses.
- **HE-into-smoke combinations:** The signature CS2 maneuver (clearing a smoke with an HE) is not captured as a structured combo in any lineup database.
- **Origin-first browsing:** Most platforms are destination-first (pick where you want the grenade to land). No platform offers origin-first browsing (I'm standing at T-spawn — what can I throw from here?).
- **Adaptive utility guidance:** No platform adapts recommendations based on the opponent's behavior. "They always hold window on Mirage? Here's the counter-utility for that."

## 5.5 Recommended Learning Path — From Scratch to Mastery

### Phase 1: Foundation (1-2 weeks, 30 minutes/day)

1. **Pick one map.** Mirage or Dust 2 — they have the clearest utility and the most resources.
2. **Learn 3 T-side smokes for A site and 2 for B site** using CS2UTIL (free, has setpos coordinates for instant practice). On Mirage A: CT-spawn, jungle, stairs. On Mirage B: market and short.
3. **Drill each smoke 30 times in practice mode** using the console commands listed in Section 1.5. The goal is automatic execution — you should be able to throw each smoke without thinking about the aim point.
4. **Play 10 competitive matches** using only your learned smokes. Focus on throwing them at the right time, not just the right place.
5. **Track your utility usage with Leetify** (free). Check your "unused utility upon death" metric — it should trend toward zero.

### Phase 2: Expansion (2-4 weeks)

6. **Add CT-side retake utility** for your chosen map. Watch one Elmapuddy video analyzing a pro retake to understand the tactical purpose before learning the lineups.
7. **Add 2 pop-flash lineups** per site from CSNADES.gg (has technique metadata — learn jump-throw vs. standing throw distinction).
8. **Add 2 molly lineups** per site (position-clearing).
9. **Watch 3 voo/Gosu Academy videos** on utility decision-making. The goal: understand WHY you throw each grenade, not just WHERE.
10. **Expand to a second map.** Apply the same principles — the second map is faster because you've internalized the underlying logic.

### Phase 3: Depth (1-3 months)

11. **Install yprac Hub** and use guided mode on all active-duty maps. Systematically learn 5 lineups per side per site.
12. **Start using Refrag** (if willing to subscribe) for the Grenade Finder and in-game drilling.
13. **Study Elmapuddy's pro analysis** to understand coordinated team utility — not just your grenades, but how they fit into a 5-player execute.
14. **Learn counter-utility** — what to do when the opponent reads your utility pattern (adjust timing, throw different grenade, fake utility at one site and attack another).
15. **Begin tracking HLTV utility damage stats** for pro players at your preferred positions to benchmark your own performance.

### Phase 4: Mastery (ongoing)

16. **Develop team protocols** with regular teammates — agreed-upon utility sequences for specific calls.
17. **Practice adaptive utility** — throw different utility based on what the opponent is doing, not what you drilled.
18. **Study IGL utility allocation** — how top IGLs (apEX, Aleksib, karrigan, FalleN) distribute utility across their team per round.
19. **Contribute to the community** — share discovered lineups on CSNades.eu, create Steam guides, help newer players.
20. **When a map is patched or a new map enters the pool, derive your own utility from first principles** rather than waiting for someone else to publish lineups. You should be able to walk onto a new map, identify the key sightlines, and figure out good-enough utility within 30 minutes.

## 5.6 The Principles That Let You Derive Your Own Utility

Once internalized, these principles let you figure out where to throw utility on ANY map — new, patched, or unfamiliar — without memorizing anyone else's lineups:

### 1. The Sightline Principle
Every engagement in CS2 happens along a sightline — a straight line between two positions where players can see each other. Smokes exist to cancel sightlines. To find where to smoke on a new map: identify the longest, most dangerous sightlines (AWP angles, long corridors, cross-map gaps). Those are your smoking priorities.

### 2. The Isolation Principle
CS2 is won by isolating fights into 1v1s rather than fighting into crossfires. When taking a site, count the number of crossfire angles the defenders have. Each smoke that removes one crossfire angle turns a 1v3 into sequential 1v1s. The number of smokes you need for a site execute equals the number of independent crossfire angles minus one.

### 3. The Chokepoint Principle
Every map has natural chokepoints — narrow passages where movement is constrained. Chokepoints are where area-denial utility (mollies, incendiaries) has maximum impact because the fire fills the entire width. When playing CT-side, identify the chokepoints the enemy must pass through. Those are your molly/incendiary priorities.

### 4. The Timing Principle
Utility is about timing, not just positioning. A perfectly-placed smoke thrown 10 seconds too early fades before the execute. A pop-flash that detonates 0.5 seconds after the entry peek is worthless. The principle: plan your utility BACKWARD from the action it enables. "The entry fragger peeks at T=0. The flash must pop at T=-0.1. I must throw it at T=-0.8. I must be in position at T=-2.0."

### 5. The Economy Principle
A smoke that removes an AWPer from the equation ($4,750 weapon) costs $300. A molly that forces a defender off a $3,100 M4 position costs $400. Utility is the most cost-efficient tool in CS2. The principle: before every round, calculate the economic value of each grenade. If your utility removes more economic value than it costs, you're winning the economy war even before the shooting starts.

### 6. The Information Asymmetry Principle
Smokes block information in both directions. A smoke in mid-doors blocks the CT from seeing Ts, but also blocks the Ts from seeing CTs. The key question for every smoke: "Does this smoke help me more than it helps the opponent?" If the answer is yes, throw it. If the smoke gives the opponent equal or greater information denial, consider a different approach.

### 7. The Rotation Mathematics Principle
Every map has calculable rotation times between sites. A smoke in a rotation path adds X seconds to the rotation time. A molly adds Y seconds. The principle: calculate the total delay your utility creates and compare it to the rotation time. If utility delay > rotation time, you have a guaranteed numbers advantage at the target site.

### 8. The Counter-Utility Readiness Principle
For every canonical utility position, there exists a counter — an HE that clears a smoke, a molly that denies a flash position, a push-through that punishes a predictable smoke timing. The principle: once you learn your own utility, immediately ask "what is the counter to this?" and learn the counter-counter. Utility mastery is an arms race, not a destination.

---

## 5.7 The Underappreciated Role of Demo Review in Utility Learning

No lineup database can teach what watching your own demos can. Demo review is the bridge between knowing lineups and using them effectively.

**What demo review reveals about your utility:**
- **Timing failures:** You know the Xbox smoke lineup, but you threw it at 1:35 instead of 1:48 because you were hesitating in T-spawn. The smoke faded before your team committed. A lineup database can't diagnose this — only watching your own round can.
- **Wasted utility:** You bought full utility but died with a smoke and a molly unused. Leetify's "unused utility upon death" metric flags this, but demo review shows you WHY you held them — usually because you had no plan for them, not because you were saving them.
- **Coordination gaps:** You threw your A-execute smoke at 0:55, but your teammate threw his at 0:50. The 5-second gap meant the CTs saw the first smoke and repositioned before the second landed, making both smokes less effective than they would have been simultaneously.
- **Opponent adaptation:** The enemy pushed through your banana smoke three rounds in a row, but you kept throwing the same smoke. Demo review reveals the pattern; a lineup database cannot.

**Demo review tools with utility relevance:**
- **CS2.CAM (cs2.cam):** Browser-based CS2 demo viewer and analysis tool. Allows 2D overhead playback where you can watch utility deployment across all 10 players simultaneously — impossible from first-person perspective.
- **Refrag 2D Demo Viewer:** Available at Competitor tier. Shows utility trajectories and landing positions overlaid on the map.
- **SCOPE.gg match analysis:** Post-match analytics showing where your utility was thrown and its effectiveness.

**The learning loop that no single platform provides:**
1. Play a match (competitive/FACEIT)
2. Track utility performance (Leetify/SCOPE.gg)
3. Identify gaps (threw too few smokes? Wrong timing? Unused utility?)
4. Learn the specific lineups to fill gaps (CS2UTIL/CSNADES.gg)
5. Drill those lineups (yprac/Refrag/practice mode)
6. Play another match and compare
7. Review demo to diagnose remaining issues
8. Repeat

This loop requires stitching together 4-5 different platforms. No single tool covers it end-to-end.

## 5.8 The Future of CS2 Utility Learning

Several trends are shaping where the ecosystem is heading:

**AI-powered lineup discovery:** Refrag's Grenade Finder already reverse-calculates throw positions from desired landing targets. The next step is AI that analyzes your match demos and suggests specific lineups that would have improved specific rounds — "in round 14, if you had smoked CT-spawn from this position, the retake would have succeeded."

**In-game integration:** CS2's built-in Map Guide system is the first step toward utility learning being native to the game rather than requiring external tools. If Valve continues expanding this feature (adding difficulty ratings, community-curated collections, in-game guided drills), many standalone platforms may become redundant.

**Video-first to interactive-first:** The YouTube tutorial model (watch a video, try to replicate) is being displaced by interactive models (click on a map, see the lineup, copy coordinates, drill in-game). CS2UTIL, SCOPE.gg, and Refrag all represent this shift. The next generation will likely offer AR-style overlays or in-game companion apps.

**Team utility coordination tools:** The biggest gap in the current ecosystem — tools for coordinating multi-player utility — will likely be filled by team management platforms. Imagine a tool where an IGL draws an execute on a 2D map, assigns utility to each player, and each player receives their specific lineup with drill instructions. This doesn't exist yet, but the demand is clear.

**Community-driven meta tracking:** As the CS2 meta continues evolving with each patch, the community's ability to rapidly identify which lineups broke and which new possibilities opened up will become a competitive advantage. Platforms that can crowdsource lineup validation (did this smoke survive the latest patch?) will outperform editorial-curated databases that take weeks to update.

---

## Sources

### Dedicated Platforms
- [CS2UTIL](https://www.cs2util.com/)
- [CSNADES.gg](https://csnades.gg/)
- [CSNades.eu](https://csnades.eu/)
- [lineups.gg](https://lineups.gg/)
- [CSDB.gg](https://csdb.gg/)
- [CS2Tricks / NadeKing](https://www.cs2tricks.com/)
- [CS2.app](https://www.cs2.app/)
- [SCOPE.gg Grenade Predictor](https://scope.gg/grenade-predictor)
- [Refrag](https://refrag.gg/)
- [Refrag Utility Training](https://refrag.gg/utility/)
- [Tracker.gg CS2 Lineups](https://tracker.gg/cs2/lineups)
- [CSGOnades (now Clash.gg)](https://www.csgonades.com/)

### Mobile Apps
- [Smoke Baron - App Store](https://apps.apple.com/us/app/smoke-baron-cs2-nade-guide/id1499252194)
- [Smoke Baron - Google Play](https://play.google.com/store/apps/details?id=com.stadtrausch.csgotacticguidepro)
- [Util Master - Google Play](https://play.google.com/store/apps/details?id=com.hartvig_develop.util_master)

### YouTube Channels
- [NadeKing](https://www.youtube.com/NadeKing)
- [Elmapuddy](https://www.youtube.com/Elmapuddy)
- [vooCSGO](https://www.youtube.com/vooCSGO)
- [TheWarOwl](https://www.youtube.com/@TheWarOwl)
- [3kliksphilip](https://www.youtube.com/@3kliksphilip)
- [n0thing](https://www.youtube.com/@n0thing)
- [CS2 Library](https://www.youtube.com/@CS2MainLibrary)

### Coaching and Education
- [Gosu Academy](https://gosuacademy.com/)
- [Gosu Academy - VooCSGO Bootcamp](https://gosuacademy.com/pages/voo-bootcamp)
- [Metafy CS2 Guides](https://metafy.gg/counter-strike-2/guides)
- [Metafy Sessions](https://metafy.gg/sessions)

### Workshop Maps
- [yprac Hub by Yesber](https://steamcommunity.com/sharedfiles/filedetails/?id=3070715607)
- [yprac.com](https://yprac.com/)
- [CS2 Nades 101](https://steamcommunity.com/workshop/filedetails/?id=3480635433)
- [CS2 Workshop Maps Collection](https://steamcommunity.com/sharedfiles/filedetails/?id=3575735192)

### Analytics
- [Leetify](https://leetify.com/)
- [SCOPE.gg](https://scope.gg/)
- [HLTV Statistics](https://www.hltv.org/stats?csVersion=CS2)
- [Leetify Stats Glossary](https://leetify.com/blog/leetify-stats-glossary/)

### Editorial and Analytical
- [TalkEsport: Rise of Utility-Based Plays](https://www.talkesport.com/editorials/the-rise-of-utility-based-plays-in-cs2-has-raw-aim-taken-a-backseat/)
- [Switchblade Gaming: CS2 Utility Lineups 2026](https://www.switchbladegaming.com/cs2/utility-lineups/)
- [BLAST.tv Smoke Guides](https://blast.tv/article/cs2-overpass-smokes)
- [Refrag Blog: Essential Smokes](https://refrag.gg/blog/essential-smokes-the-most-important-smokes-on-each-map-in-cs2/)
- [Refrag: Dust2 Utility Secrets](https://refrag.gg/blog/cs2-utility-secrets-5-must-know-nades-for-dust2/)
- [FULLSYNC: CS2 Grenade Meta 2026](https://fullsync.co.uk/cs2-grenade-meta-in-2026/)
- [CS2 Pulse: Banana Control Analysis](https://cs2pulse.com/banana-control-on-inferno-after-update-and-changes-as-t/)
- [Dignitas: CS2 Smokes Explained](https://dignitas.gg/articles/cs2-smokes-explanation-and-tips)
- [ZLeague: Volumetric Smoke Changes](https://www.zleague.gg/theportal/cs2-volumetric-smoke-changes-explained/)

### Community
- [CS2UTIL Discord Community](https://www.cs2util.com/)
- [Academy Gaming Discord](https://blog.cs2.ad/cs2-discord-servers/)
- [CS2 Pulse: Biggest CS2 Discord Servers](https://cs2pulse.com/10-biggest-discord-servers-for-cs2-fans/)
- [r/GlobalOffensive](https://www.reddit.com/r/GlobalOffensive/)

### Map Pool and Economy
- [Active Duty Map Pool 2026](https://tradeit.gg/blog/cs2-maps/)
- [CS2 Map Pool 2026 Premier Rotation](https://csgamble.com/cs2-maps-guide-2026/)
- [Cache CS2 Return Guide](https://blog.cs2.ad/cache-cs2/)
- [CS2 Economy Guide (Post July 2025)](https://community.skin.club/en/news/how-the-new-cs2-economy-works)

### Smoke Guides (Per-Map)
- [Mirage Smokes - skin.land](https://skin.land/blog/all-best-cs2-mirage-smokes/)
- [Mirage Smokes - BLAST.tv](https://blast.tv/article/cs2-mirage-smokes)
- [Inferno Smokes - skin.club](https://community.skin.club/en/articles/best-cs2-smoke-spots-on-inferno)
- [Dust2 Smokes - BLAST.tv](https://blast.tv/cs/news/every-smoke-you-need-to-know-on-dust2-in-cs2)
- [Nuke Smokes - BLAST.tv](https://blast.tv/article/cs2-Nuke-smokes)
- [Ancient Smokes - BLAST.tv](https://blast.tv/article/cs2-ancient-smokes)
- [Overpass Smokes - BLAST.tv](https://blast.tv/article/cs2-overpass-smokes)
- [Vertigo Smokes - BLAST.tv](https://blast.tv/article/cs2-vertigo-smokes)
- [Anubis Smokes - skin.land](https://skin.land/blog/best-cs2-anubis-smokes-lineups/)
- [Cache Smokes - bo3.gg](https://bo3.gg/articles/cs2-cache-smokes-guide-best-lineups-for-every-site)
