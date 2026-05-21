#!/usr/bin/env node
/**
 * fix-coords-v2.mjs
 *
 * Corrects radarPos / radarTarget percentage coordinates in all map data files.
 *
 * Reference sources:
 *  - cs2util.com 2D map nade landing markers (percentage positions)
 *  - cs2util.com callout label positions
 *  - Verified LANDMARK_POINTS from map-coordinates.test.js
 *  - Valve RADAR_METADATA (pos_x, pos_y, scale)
 *
 * Each correction maps { lineupId → { radarPos, radarTarget } }.
 * Values are {x, y} radar percentages (0-100) matching the SVG viewBox.
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, "..", "data");

// ─── DUST2 corrections ───────────────────────────────────────
// Reference: csutil.com Dust2 2D map, test landmarks
// T Spawn ≈ (40, 89), A Site ≈ (82, 16), B Site ≈ (25, 16)
// CT Spawn ≈ (61, 18), Xbox ≈ (46, 43), Long Doors ≈ (69, 55)
const dust2 = {
  xbox_smoke: {
    radarPos:    { x: 40, y: 89 },   // T Spawn — verified via test landmark (40.4, 88.7)
    radarTarget: { x: 46, y: 43 },   // Xbox — csutil "Mid Xbox Smoke" marker
  },
  long_cross_smoke: {
    radarPos:    { x: 72, y: 78 },   // Outside Long Doors, T side
    radarTarget: { x: 73, y: 55 },   // Long Doors crossing gap
  },
  a_ct_smoke: {
    radarPos:    { x: 87, y: 63 },   // A Long near pit/blue dumpster
    radarTarget: { x: 67, y: 23 },   // CT Spawn area — csutil "CT Spanw Smoke For Cross"
  },
  a_long_flash: {
    radarPos:    { x: 85, y: 55 },   // Inside Long Doors, right side
    radarTarget: { x: 87, y: 48 },   // Pops over A Long toward site
  },
  ct_molly_from_long: {
    radarPos:    { x: 87, y: 63 },   // A Long near pit area
    radarTarget: { x: 62, y: 18 },   // CT Spawn behind boxes
  },
  a_short_flash: {
    radarPos:    { x: 60, y: 40 },   // Top of catwalk stairs
    radarTarget: { x: 67, y: 28 },   // Over A Short toward A site
  },
  b_window_smoke: {
    radarPos:    { x: 18, y: 50 },   // Upper B Tunnels — csutil "Upper Tunnels Smoke" pos
    radarTarget: { x: 26, y: 13 },   // B Window — csutil "B Window Smoke" marker
  },
  b_car_smoke: {
    radarPos:    { x: 19, y: 48 },   // Upper B Tunnels, near archway exit
    radarTarget: { x: 24, y: 40 },   // B Car / platform area
  },
  b_site_molly: {
    radarPos:    { x: 19, y: 49 },   // Upper B Tunnels, center corridor
    radarTarget: { x: 20, y: 24 },   // Behind double stack boxes on B site
  },
  b_tunnel_flash: {
    radarPos:    { x: 20, y: 50 },   // Upper B Tunnels, behind entry player
    radarTarget: { x: 22, y: 38 },   // B Site entrance from tunnel exit
  },
  mid_to_b_smoke: {
    radarPos:    { x: 44, y: 38 },   // Lower mid/CT Mid area past Xbox
    radarTarget: { x: 24, y: 37 },   // B Short/Doors passage from mid
  },
  ct_long_doors_smoke: {
    radarPos:    { x: 79, y: 19 },   // A Site near barrels — csutil "Barrels" area
    radarTarget: { x: 73, y: 57 },   // Long Doors blocking T push
  },
  ct_b_tuns_smoke: {
    radarPos:    { x: 16, y: 28 },   // B Site behind Big Box
    radarTarget: { x: 22, y: 44 },   // B Tunnel exit / archway
  },
  ct_mid_smoke: {
    radarPos:    { x: 64, y: 18 },   // CT Spawn, right side facing mid
    radarTarget: { x: 46, y: 38 },   // Mid Doors area — csutil "Mid Doors Smoke"
  },
  ct_b_tuns_molly: {
    radarPos:    { x: 16, y: 28 },   // B Site behind Big Box
    radarTarget: { x: 22, y: 45 },   // B Tunnel exit archway (behind smoke)
  },
  ct_a_retake_flash: {
    radarPos:    { x: 68, y: 22 },   // CT Spawn approaching A ramp
    radarTarget: { x: 75, y: 20 },   // Pops over A Site
  },
  ct_long_molly: {
    radarPos:    { x: 80, y: 33 },   // A Site / Long Corner
    radarTarget: { x: 73, y: 57 },   // Long Doors, T-side of smoke
  },
};

// ─── INFERNO corrections ─────────────────────────────────────
// T Spawn ≈ (8, 71), A Site ≈ (83, 71), B Site ≈ (45, 20)
// CT Spawn ≈ (52, 13), Banana ≈ (47, 57), Pit ≈ (83, 81)
// Bottom Banana ≈ (26, 65), Top Banana ≈ (40, 33), Apartments ≈ (52, 55)
// Library ≈ (66, 25), Construction ≈ (46, 19), Arch ≈ (50, 30)
const inferno = {
  banana_ct_smoke: {
    radarPos:    { x: 26, y: 65 },   // Bottom Banana, behind cart
    radarTarget: { x: 46, y: 20 },   // Construction/CT near B site entrance
  },
  banana_coffins_smoke: {
    radarPos:    { x: 38, y: 35 },   // Top Banana, left side
    radarTarget: { x: 34, y: 21 },   // Coffins/Spools on B site
  },
  b_site_molly: {
    radarPos:    { x: 38, y: 34 },   // Top Banana, right side
    radarTarget: { x: 36, y: 23 },   // Dark / first pillar on B site
  },
  banana_close_molly: {
    radarPos:    { x: 26, y: 68 },   // Bottom Banana, behind cart
    radarTarget: { x: 32, y: 50 },   // Close angle car/sandbags mid-banana
  },
  banana_flash: {
    radarPos:    { x: 26, y: 68 },   // Bottom Banana, right side
    radarTarget: { x: 32, y: 52 },   // Pops mid-banana over wall
  },
  a_pit_smoke: {
    radarPos:    { x: 52, y: 55 },   // Apartments stairs near Boiler
    radarTarget: { x: 83, y: 80 },   // Pit — below A Site
  },
  a_library_smoke: {
    radarPos:    { x: 52, y: 55 },   // Apartments window near Boiler
    radarTarget: { x: 66, y: 25 },   // Library / Back Site
  },
  a_arch_smoke: {
    radarPos:    { x: 55, y: 53 },   // Apartments balcony, right side
    radarTarget: { x: 50, y: 30 },   // Arch / CT rotation path
  },
  apps_flash: {
    radarPos:    { x: 58, y: 55 },   // Apartments exit doorway
    radarTarget: { x: 66, y: 63 },   // A site area from Apps
  },
  a_site_molly: {
    radarPos:    { x: 57, y: 53 },   // Apartments balcony
    radarTarget: { x: 78, y: 68 },   // A site default / hay bales
  },
  mid_smoke: {
    radarPos:    { x: 14, y: 72 },   // T Ramp, left side near phone booth
    radarTarget: { x: 38, y: 48 },   // Mid / Short passage
  },
  ct_banana_smoke: {
    radarPos:    { x: 42, y: 23 },   // B site platform near fountain
    radarTarget: { x: 36, y: 42 },   // Mid-banana blocking T push
  },
  ct_banana_molly: {
    radarPos:    { x: 42, y: 23 },   // B site platform near fountain
    radarTarget: { x: 37, y: 38 },   // Top banana behind smoke
  },
  ct_arch_flash: {
    radarPos:    { x: 48, y: 30 },   // Arch passage, right side
    radarTarget: { x: 66, y: 58 },   // A site area
  },
  ct_pit_molly: {
    radarPos:    { x: 66, y: 28 },   // Library / Back Site
    radarTarget: { x: 83, y: 80 },   // Pit
  },
  ct_apps_smoke: {
    radarPos:    { x: 78, y: 68 },   // A site behind default box
    radarTarget: { x: 60, y: 58 },   // Apartments exit doorway
  },
  ct_b_retake_flash: {
    radarPos:    { x: 52, y: 18 },   // CT spawn rotating toward B
    radarTarget: { x: 42, y: 22 },   // B site
  },
};

// ─── MIRAGE corrections ──────────────────────────────────────
// T Spawn ≈ (85, 37), A Site ≈ (59, 57), B Site ≈ (20, 26)
// CT Spawn ≈ (51, 6), Jungle ≈ (48, 41), Window ≈ (48, 30)
// Stairs ≈ (61, 61), Palace ≈ (67, 61), A Ramp ≈ (71, 53)
// B Apartments ≈ (22, 37), B Short ≈ (30, 30), Market ≈ (28, 18)
// Connector ≈ (46, 34), Underpass ≈ (40, 41), Top Mid ≈ (67, 34)
const mirage = {
  window_smoke: {
    radarPos:    { x: 85, y: 37 },   // T Spawn
    radarTarget: { x: 48, y: 30 },   // Window / Snipers Nest
  },
  jungle_smoke: {
    radarPos:    { x: 85, y: 37 },   // T Spawn
    radarTarget: { x: 48, y: 41 },   // Jungle
  },
  ct_smoke: {
    radarPos:    { x: 85, y: 37 },   // T Spawn
    radarTarget: { x: 55, y: 10 },   // CT crossing area
  },
  stairs_smoke: {
    radarPos:    { x: 85, y: 37 },   // T Spawn
    radarTarget: { x: 61, y: 58 },   // Stairs on A Site
  },
  a_ramp_flash: {
    radarPos:    { x: 73, y: 48 },   // A Ramp corridor approach
    radarTarget: { x: 65, y: 55 },   // Over A Ramp toward A Site
  },
  a_site_molly: {
    radarPos:    { x: 67, y: 58 },   // Palace exit area
    radarTarget: { x: 59, y: 57 },   // A Site default plant spot
  },
  short_smoke: {
    radarPos:    { x: 55, y: 38 },   // Top Mid area
    radarTarget: { x: 38, y: 33 },   // Short / Connector area
  },
  b_apartments_smoke: {
    radarPos:    { x: 22, y: 37 },   // B Apartments
    radarTarget: { x: 28, y: 18 },   // Market Window
  },
  b_short_smoke: {
    radarPos:    { x: 22, y: 37 },   // B Apartments
    radarTarget: { x: 30, y: 30 },   // B Short
  },
  b_site_molly: {
    radarPos:    { x: 22, y: 37 },   // B Apartments
    radarTarget: { x: 20, y: 26 },   // B Site Bench
  },
  b_apps_flash: {
    radarPos:    { x: 22, y: 37 },   // B Apartments entrance
    radarTarget: { x: 20, y: 28 },   // B Site area
  },
  ct_a_ramp_smoke: {
    radarPos:    { x: 61, y: 58 },   // Stairs on A Site
    radarTarget: { x: 71, y: 53 },   // A Ramp
  },
  ct_palace_smoke: {
    radarPos:    { x: 59, y: 57 },   // A Site
    radarTarget: { x: 67, y: 61 },   // Palace exit
  },
  ct_b_apartments_smoke: {
    radarPos:    { x: 20, y: 26 },   // B Site
    radarTarget: { x: 22, y: 37 },   // B Apartments entrance
  },
  ct_b_molly: {
    radarPos:    { x: 20, y: 26 },   // B Site
    radarTarget: { x: 22, y: 39 },   // B Apartments (anti-rush)
  },
  ct_window_molly: {
    radarPos:    { x: 46, y: 34 },   // Connector, below Window
    radarTarget: { x: 48, y: 30 },   // Window (anti-boost)
  },
  jungle_retake_flash: {
    radarPos:    { x: 48, y: 41 },   // Jungle
    radarTarget: { x: 59, y: 57 },   // A Site retake
  },
  b_retake_flash: {
    radarPos:    { x: 30, y: 30 },   // B Short
    radarTarget: { x: 20, y: 26 },   // B Site
  },
  palace_flash: {
    radarPos:    { x: 67, y: 58 },   // Inside Palace
    radarTarget: { x: 59, y: 57 },   // A Site
  },
  underpass_to_b_smoke: {
    radarPos:    { x: 40, y: 41 },   // Underpass
    radarTarget: { x: 25, y: 28 },   // B Site / Short area
  },
};

// ─── ANCIENT corrections ─────────────────────────────────────
// T Spawn ≈ (48, 86), CT Spawn ≈ (54, 9), A Site ≈ (30, 38)
// B Site ≈ (69, 38), Mid ≈ (52, 50), Red Room ≈ (54, 31)
// Donut ≈ (42, 35), A Main ≈ (26, 50), B Main ≈ (66, 58)
// Cave ≈ (62, 46), Temple ≈ (34, 27), Elbow ≈ (46, 27)
const ancient = {
  red_room: {
    radarPos:    { x: 48, y: 78 },   // T Spawn approach toward mid
    radarTarget: { x: 54, y: 31 },   // Red Room / Top Mid
  },
  mid_donut_smoke: {
    radarPos:    { x: 50, y: 60 },   // Mid approach from T
    radarTarget: { x: 42, y: 35 },   // Donut
  },
  a_ct_smoke: {
    radarPos:    { x: 26, y: 50 },   // A Main
    radarTarget: { x: 40, y: 18 },   // CT rotation path near A
  },
  a_temple_smoke: {
    radarPos:    { x: 26, y: 50 },   // A Main
    radarTarget: { x: 34, y: 27 },   // Temple
  },
  a_donut_smoke: {
    radarPos:    { x: 26, y: 50 },   // A Main
    radarTarget: { x: 42, y: 35 },   // Donut
  },
  ct_from_donut: {
    radarPos:    { x: 42, y: 35 },   // Donut area
    radarTarget: { x: 41, y: 20 },   // CT / Elbow junction near A
  },
  b_cave_smoke: {
    radarPos:    { x: 66, y: 58 },   // B Main
    radarTarget: { x: 62, y: 46 },   // Cave
  },
  b_short_smoke: {
    radarPos:    { x: 66, y: 58 },   // B Main
    radarTarget: { x: 69, y: 38 },   // B Short / B Site
  },
  b_long_smoke: {
    radarPos:    { x: 66, y: 58 },   // B Main
    radarTarget: { x: 72, y: 32 },   // B Long (toward CT)
  },
  b_lurk_smoke: {
    radarPos:    { x: 48, y: 82 },   // T Spawn area
    radarTarget: { x: 60, y: 52 },   // B area lurk
  },
  a_main_pop_flash: {
    radarPos:    { x: 26, y: 50 },   // A Main
    radarTarget: { x: 30, y: 38 },   // A Site
  },
  b_main_pop_flash: {
    radarPos:    { x: 66, y: 58 },   // B Main
    radarTarget: { x: 69, y: 40 },   // B Site
  },
  ninja_molly: {
    radarPos:    { x: 26, y: 50 },   // A Main
    radarTarget: { x: 28, y: 30 },   // A Site ninja / behind boxes
  },
  b_pillar_molly: {
    radarPos:    { x: 66, y: 55 },   // B Main approach
    radarTarget: { x: 69, y: 38 },   // B Site pillar
  },
  a_site_he: {
    radarPos:    { x: 27, y: 50 },   // A Main
    radarTarget: { x: 30, y: 35 },   // A Site default box
  },
  b_ramp_he: {
    radarPos:    { x: 66, y: 56 },   // B Main
    radarTarget: { x: 70, y: 42 },   // B Ramp
  },
  ct_elbow_smoke: {
    radarPos:    { x: 54, y: 12 },   // CT Spawn
    radarTarget: { x: 46, y: 27 },   // Elbow
  },
  ct_mid_incendiary: {
    radarPos:    { x: 48, y: 25 },   // Red Room / CT side
    radarTarget: { x: 48, y: 38 },   // Mid / Elbow area
  },
  ct_a_main_molly: {
    radarPos:    { x: 30, y: 35 },   // A Site
    radarTarget: { x: 26, y: 50 },   // A Main
  },
  ct_b_main_molly: {
    radarPos:    { x: 69, y: 38 },   // B Site
    radarTarget: { x: 66, y: 55 },   // B Main
  },
  ct_a_retake_flash: {
    radarPos:    { x: 40, y: 15 },   // CT area rotating toward A
    radarTarget: { x: 30, y: 38 },   // A Site
  },
  ct_b_retake_flash: {
    radarPos:    { x: 62, y: 46 },   // Cave
    radarTarget: { x: 69, y: 38 },   // B Site
  },
};

// ─── ANUBIS corrections ──────────────────────────────────────
// T Spawn ≈ (48, 90), CT Spawn ≈ (43, 21), A Site ≈ (22, 40)
// B Site ≈ (67, 40), Mid ≈ (45, 55), A Main ≈ (19, 62)
// B Main ≈ (64, 62), Connector ≈ (49, 36), A Heaven ≈ (26, 29)
// B Heaven ≈ (64, 29), Canal ≈ (56, 47)
const anubis = {
  mid_connector_smoke: {
    radarPos:    { x: 48, y: 78 },   // T Spawn approach
    radarTarget: { x: 49, y: 36 },   // Connector
  },
  mid_flash: {
    radarPos:    { x: 48, y: 75 },   // T Spawn mid approach
    radarTarget: { x: 45, y: 55 },   // Mid area
  },
  a_main_ct_smoke: {
    radarPos:    { x: 19, y: 62 },   // A Main
    radarTarget: { x: 26, y: 29 },   // CT / A Heaven area
  },
  a_heaven_smoke: {
    radarPos:    { x: 19, y: 62 },   // A Main
    radarTarget: { x: 26, y: 29 },   // A Heaven
  },
  a_main_pop_flash: {
    radarPos:    { x: 19, y: 58 },   // A Main
    radarTarget: { x: 22, y: 40 },   // A Site
  },
  b_main_smoke: {
    radarPos:    { x: 64, y: 62 },   // B Main
    radarTarget: { x: 64, y: 29 },   // B Heaven / Pillar
  },
  b_site_molly: {
    radarPos:    { x: 64, y: 58 },   // B Main approach
    radarTarget: { x: 67, y: 40 },   // B Site default
  },
  b_main_pop_flash: {
    radarPos:    { x: 64, y: 60 },   // B Main
    radarTarget: { x: 67, y: 38 },   // B Site
  },
  b_heaven_he: {
    radarPos:    { x: 64, y: 60 },   // B Main
    radarTarget: { x: 64, y: 29 },   // B Heaven
  },
  ct_mid_smoke: {
    radarPos:    { x: 43, y: 21 },   // CT Spawn
    radarTarget: { x: 45, y: 55 },   // Mid
  },
  ct_a_main_smoke: {
    radarPos:    { x: 26, y: 32 },   // A Site / A Heaven
    radarTarget: { x: 19, y: 55 },   // A Main
  },
  ct_b_main_molly: {
    radarPos:    { x: 67, y: 32 },   // B Site area
    radarTarget: { x: 64, y: 55 },   // B Main
  },
  ct_canal_smoke: {
    radarPos:    { x: 43, y: 25 },   // CT area
    radarTarget: { x: 56, y: 47 },   // Canal
  },
  ct_a_retake_flash: {
    radarPos:    { x: 35, y: 20 },   // CT near A
    radarTarget: { x: 26, y: 32 },   // A Heaven / A Site
  },
  ct_b_retake_flash: {
    radarPos:    { x: 55, y: 22 },   // CT near B
    radarTarget: { x: 64, y: 32 },   // B Site / Heaven
  },
  ct_a_main_molly: {
    radarPos:    { x: 24, y: 32 },   // A Site / Heaven area
    radarTarget: { x: 19, y: 55 },   // A Main
  },
};

// ─── OVERPASS corrections ────────────────────────────────────
// T Spawn ≈ (64, 91), CT Spawn ≈ (49, 20), A Site ≈ (31, 26)
// B Site ≈ (68, 45), Connector ≈ (46, 37), Monster ≈ (76, 56)
// A Long ≈ (19, 41), Bathrooms ≈ (57, 60), Heaven ≈ (64, 30)
// Water ≈ (61, 52), Bank ≈ (38, 26), Playground ≈ (34, 49)
const overpass = {
  bathrooms_b_heaven_smoke: {
    radarPos:    { x: 57, y: 60 },   // Bathrooms
    radarTarget: { x: 64, y: 30 },   // B Heaven
  },
  monster_smoke: {
    radarPos:    { x: 76, y: 62 },   // Monster approach
    radarTarget: { x: 76, y: 52 },   // Monster exit
  },
  a_long_smoke: {
    radarPos:    { x: 19, y: 48 },   // A Long T-side approach
    radarTarget: { x: 19, y: 38 },   // A Long
  },
  connector_smoke_t: {
    radarPos:    { x: 50, y: 58 },   // T side approach
    radarTarget: { x: 46, y: 37 },   // Connector
  },
  b_site_pop_flash: {
    radarPos:    { x: 61, y: 52 },   // Water area
    radarTarget: { x: 68, y: 45 },   // B Site
  },
  a_long_molly: {
    radarPos:    { x: 19, y: 45 },   // A Long approach
    radarTarget: { x: 22, y: 38 },   // A Long default
  },
  bank_smoke: {
    radarPos:    { x: 19, y: 45 },   // A Long
    radarTarget: { x: 38, y: 26 },   // Bank
  },
  a_site_flash: {
    radarPos:    { x: 19, y: 41 },   // A Long
    radarTarget: { x: 31, y: 26 },   // A Site
  },
  b_pillar_molly: {
    radarPos:    { x: 76, y: 56 },   // Monster area
    radarTarget: { x: 70, y: 48 },   // B Site pillar
  },
  water_connector_he: {
    radarPos:    { x: 61, y: 52 },   // Water
    radarTarget: { x: 46, y: 37 },   // Connector
  },
  playground_smoke: {
    radarPos:    { x: 19, y: 45 },   // A Long
    radarTarget: { x: 34, y: 49 },   // Playground
  },
  ct_monster_smoke: {
    radarPos:    { x: 68, y: 45 },   // B Site
    radarTarget: { x: 76, y: 56 },   // Monster
  },
  ct_connector_smoke: {
    radarPos:    { x: 58, y: 28 },   // CT / Heaven area
    radarTarget: { x: 46, y: 40 },   // Connector
  },
  ct_long_a_molly: {
    radarPos:    { x: 31, y: 26 },   // A Site
    radarTarget: { x: 19, y: 42 },   // A Long
  },
  ct_b_short_flash: {
    radarPos:    { x: 65, y: 40 },   // B Site area
    radarTarget: { x: 68, y: 48 },   // B Short / Water
  },
  ct_long_a_smoke: {
    radarPos:    { x: 31, y: 26 },   // A Site
    radarTarget: { x: 22, y: 40 },   // A Long
  },
  ct_monster_molly: {
    radarPos:    { x: 68, y: 45 },   // B Site
    radarTarget: { x: 76, y: 56 },   // Monster
  },
  ct_a_retake_flash: {
    radarPos:    { x: 52, y: 20 },   // CT Spawn
    radarTarget: { x: 31, y: 26 },   // A Site
  },
  ct_water_smoke: {
    radarPos:    { x: 68, y: 45 },   // B Site
    radarTarget: { x: 61, y: 52 },   // Water / Sewers
  },
};

// ─── NUKE corrections ────────────────────────────────────────
// T Spawn ≈ (22, 55), CT Spawn ≈ (83, 45), A Site ≈ (55, 29)
// Outside ≈ (31, 40), Lobby ≈ (43, 46), Ramp ≈ (48, 49)
// Hut ≈ (51, 32), Heaven ≈ (59, 24), Mini ≈ (40, 29)
// Trophy ≈ (65, 35), Secret ≈ (37, 32), Squeaky ≈ (45, 35)
const nuke = {
  outside_smoke: {
    radarPos:    { x: 25, y: 50 },   // T Spawn / Outside approach
    radarTarget: { x: 38, y: 35 },   // Outside blocking heaven view
  },
  mini_smoke: {
    radarPos:    { x: 28, y: 45 },   // Outside area
    radarTarget: { x: 40, y: 29 },   // Mini / Garage
  },
  outside_heaven_molly: {
    radarPos:    { x: 28, y: 48 },   // Outside area
    radarTarget: { x: 59, y: 24 },   // Heaven
  },
  hut_smoke: {
    radarPos:    { x: 43, y: 46 },   // Lobby
    radarTarget: { x: 51, y: 32 },   // Hut
  },
  a_main_pop_flash: {
    radarPos:    { x: 45, y: 38 },   // Squeaky approach
    radarTarget: { x: 55, y: 29 },   // A Site
  },
  ramp_smoke: {
    radarPos:    { x: 45, y: 50 },   // Lobby / Ramp approach
    radarTarget: { x: 48, y: 55 },   // Ramp bottom
  },
  ramp_sandbags_molly: {
    radarPos:    { x: 45, y: 50 },   // Ramp approach
    radarTarget: { x: 47, y: 52 },   // Ramp sandbags
  },
  lobby_pop_flash: {
    radarPos:    { x: 43, y: 46 },   // Lobby
    radarTarget: { x: 48, y: 49 },   // Ramp entrance
  },
  ramp_he: {
    radarPos:    { x: 46, y: 50 },   // Ramp approach
    radarTarget: { x: 48, y: 53 },   // Ramp room
  },
  ct_outside_smoke: {
    radarPos:    { x: 75, y: 42 },   // CT Spawn area
    radarTarget: { x: 35, y: 42 },   // Outside
  },
  ct_ramp_smoke: {
    radarPos:    { x: 50, y: 45 },   // Ramp CT side
    radarTarget: { x: 48, y: 49 },   // Ramp
  },
  trophy_molly: {
    radarPos:    { x: 55, y: 29 },   // A Site
    radarTarget: { x: 65, y: 35 },   // Trophy Room
  },
  heaven_retake_flash: {
    radarPos:    { x: 58, y: 27 },   // Heaven approach
    radarTarget: { x: 55, y: 29 },   // A Site
  },
  ct_ramp_molly: {
    radarPos:    { x: 50, y: 45 },   // Ramp CT side
    radarTarget: { x: 48, y: 52 },   // Ramp
  },
  ct_b_retake_flash: {
    radarPos:    { x: 37, y: 32 },   // Secret
    radarTarget: { x: 48, y: 55 },   // Ramp / B area
  },
};

// ─── CACHE corrections ───────────────────────────────────────
// T Spawn ≈ (39, 83), CT Spawn ≈ (32, 19), A Site ≈ (14, 29)
// B Site ≈ (60, 51), Mid ≈ (36, 44), A Main ≈ (11, 47)
// B Main ≈ (57, 61), Highway ≈ (21, 22), Squeaky ≈ (18, 40)
// Boost ≈ (36, 29), Vent ≈ (46, 36), Heaven B ≈ (57, 44)
// Checkers ≈ (64, 47), Z Connector ≈ (39, 36), Truck A ≈ (11, 33)
// Forklift ≈ (25, 29), Sunroom ≈ (60, 54), Tree ≈ (50, 47)
// Headshot ≈ (57, 47), Toxic ≈ (21, 44)
const cache = {
  t_z_connector_smoke: {
    radarPos:    { x: 38, y: 65 },   // T mid approach
    radarTarget: { x: 39, y: 36 },   // Z Connector
  },
  t_criss_cross_smoke_left: {
    radarPos:    { x: 36, y: 58 },   // T mid approach
    radarTarget: { x: 32, y: 40 },   // Left side of Mid
  },
  t_criss_cross_smoke_right: {
    radarPos:    { x: 38, y: 58 },   // T mid approach
    radarTarget: { x: 40, y: 40 },   // Right side of Mid
  },
  ct_mid_delay_smoke: {
    radarPos:    { x: 35, y: 28 },   // CT / Z connector area
    radarTarget: { x: 38, y: 55 },   // Garage / T-Ramp
  },
  t_boost_molly: {
    radarPos:    { x: 36, y: 55 },   // T mid area
    radarTarget: { x: 36, y: 29 },   // Boost / Sandbags
  },
  t_a_cross_smoke: {
    radarPos:    { x: 12, y: 48 },   // A Main approach
    radarTarget: { x: 21, y: 23 },   // A Cross / Highway / CT
  },
  t_back_a_site_smoke: {
    radarPos:    { x: 11, y: 45 },   // A Main
    radarTarget: { x: 14, y: 25 },   // Back A Site
  },
  t_highway_smoke: {
    radarPos:    { x: 18, y: 42 },   // Squeaky / T approach
    radarTarget: { x: 21, y: 22 },   // Highway
  },
  t_forklift_molly: {
    radarPos:    { x: 11, y: 42 },   // A Main
    radarTarget: { x: 25, y: 29 },   // Forklift
  },
  t_a_main_flash: {
    radarPos:    { x: 11, y: 40 },   // A Stairs area
    radarTarget: { x: 14, y: 29 },   // A Site
  },
  ct_a_main_molly_toxic: {
    radarPos:    { x: 21, y: 44 },   // Toxic
    radarTarget: { x: 11, y: 45 },   // A Main entrance
  },
  ct_a_main_smoke_truck: {
    radarPos:    { x: 11, y: 33 },   // Truck A
    radarTarget: { x: 11, y: 42 },   // A Main
  },
  t_b_heaven_smoke: {
    radarPos:    { x: 57, y: 62 },   // B Main approach
    radarTarget: { x: 57, y: 44 },   // B Heaven
  },
  t_b_tree_smoke: {
    radarPos:    { x: 55, y: 62 },   // B Main approach
    radarTarget: { x: 50, y: 45 },   // Tree Room / CT
  },
  t_b_main_smoke: {
    radarPos:    { x: 52, y: 70 },   // B Halls / T approach
    radarTarget: { x: 57, y: 62 },   // B Main entrance
  },
  t_b_main_molly: {
    radarPos:    { x: 52, y: 70 },   // B Halls
    radarTarget: { x: 57, y: 62 },   // B Main
  },
  t_b_sunroom_flash: {
    radarPos:    { x: 60, y: 54 },   // Sunroom
    radarTarget: { x: 60, y: 51 },   // B Site
  },
  t_b_site_default_molly: {
    radarPos:    { x: 60, y: 54 },   // Sunroom
    radarTarget: { x: 60, y: 51 },   // B Site default
  },
  t_b_headshot_molly: {
    radarPos:    { x: 60, y: 54 },   // Sunroom
    radarTarget: { x: 57, y: 47 },   // Headshot / Back Site
  },
  ct_b_main_anti_rush_molly: {
    radarPos:    { x: 64, y: 47 },   // Checkers
    radarTarget: { x: 57, y: 62 },   // B Main
  },
  ct_b_main_smoke: {
    radarPos:    { x: 57, y: 44 },   // B Heaven
    radarTarget: { x: 57, y: 62 },   // B Main
  },
  ct_b_checkers_flash: {
    radarPos:    { x: 64, y: 47 },   // Checkers
    radarTarget: { x: 57, y: 58 },   // B Main area
  },
};

// Dust2 already applied in previous run — apply remaining 7 maps
const ALL_CORRECTIONS = {
  inferno,
  mirage,
  ancient,
  anubis,
  overpass,
  nuke,
  cache,
};

// ═══════════════════════════════════════════════════════════════
//  Apply corrections
// ═══════════════════════════════════════════════════════════════

function formatPoint(p) {
  return `{ x: ${p.x}, y: ${p.y} }`;
}

let totalChanged = 0;
let totalSkipped = 0;

for (const [mapId, corrections] of Object.entries(ALL_CORRECTIONS)) {
  const filePath = resolve(DATA_DIR, `${mapId}.js`);
  let src;
  try {
    src = readFileSync(filePath, "utf8");
  } catch {
    console.log(`⚠  ${mapId}.js not found, skipping`);
    continue;
  }
  const original = src;
  let mapChanged = 0;
  let mapSkipped = 0;

  for (const [lineupId, fix] of Object.entries(corrections)) {
    // Find the lineup block by looking for its id field
    // Pattern: id: "lineupId", ... radarPos: { x: N, y: N }, radarTarget: { x: N, y: N }
    const idPattern = new RegExp(
      `id:\\s*"${lineupId}"[\\s\\S]*?radarPos:\\s*\\{\\s*x:\\s*[\\d.]+,\\s*y:\\s*[\\d.]+\\s*\\}`,
      "m"
    );
    const idMatch = idPattern.exec(src);
    if (!idMatch) {
      console.log(`  ⚠  ${mapId}/${lineupId}: lineup not found, skipping`);
      mapSkipped++;
      continue;
    }

    // Replace radarPos
    {
      // Find the radarPos closest to this lineup's id
      // We search from the id match position forward
      const searchFrom = idMatch.index;
      const afterId = src.substring(searchFrom);
      const posMatch = afterId.match(/radarPos:\s*\{\s*x:\s*[\d.]+,\s*y:\s*[\d.]+\s*\}/);
      if (posMatch) {
        const fullMatch = posMatch[0];
        const replacement = `radarPos: ${formatPoint(fix.radarPos)}`;
        const globalIdx = searchFrom + posMatch.index;
        src = src.substring(0, globalIdx) + replacement + src.substring(globalIdx + fullMatch.length);
      }
    }

    // Re-find the id position after radarPos replacement (offsets may have shifted)
    const idMatch2 = idPattern.exec(src);
    {
      const searchFrom = idMatch2 ? idMatch2.index : 0;
      const afterId = src.substring(searchFrom);
      const targetMatch = afterId.match(/radarTarget:\s*\{\s*x:\s*[\d.]+,\s*y:\s*[\d.]+\s*\}/);
      if (targetMatch) {
        const fullMatch = targetMatch[0];
        const replacement = `radarTarget: ${formatPoint(fix.radarTarget)}`;
        const globalIdx = searchFrom + targetMatch.index;
        src = src.substring(0, globalIdx) + replacement + src.substring(globalIdx + fullMatch.length);
      }
    }

    mapChanged++;
  }

  if (src !== original) {
    writeFileSync(filePath, src, "utf8");
    console.log(`✓  ${mapId}.js: ${mapChanged} lineups corrected, ${mapSkipped} skipped`);
  } else {
    console.log(`─  ${mapId}.js: no changes`);
  }
  totalChanged += mapChanged;
  totalSkipped += mapSkipped;
}

console.log(`\nDone. ${totalChanged} lineups corrected, ${totalSkipped} skipped.`);
