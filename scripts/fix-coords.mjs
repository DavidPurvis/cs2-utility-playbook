/**
 * Fix radar coordinates across all map data files using formula-derived
 * reference points from worldToMapPercent.
 *
 * Usage: node scripts/fix-coords.mjs
 */
import { readFileSync, writeFileSync } from 'fs';

function replaceCoords(src, marker, field, x, y) {
  const idx = src.indexOf(marker);
  if (idx === -1) { console.error('  NOT FOUND:', marker); return src; }

  const searchRegion = src.substring(idx, Math.min(idx + 2000, src.length));
  const regex = new RegExp(`(${field}:\\s*\\{)\\s*x:\\s*[\\d.]+,\\s*y:\\s*[\\d.]+\\s*(\\})`);
  const match = searchRegion.match(regex);
  if (!match) { console.error('  NO', field, 'near', marker); return src; }

  const matchStart = idx + match.index;
  const matchEnd = matchStart + match[0].length;
  const replacement = `${match[1]} x: ${x}, y: ${y} ${match[2]}`;
  return src.substring(0, matchStart) + replacement + src.substring(matchEnd);
}

function fixFile(path, lineups, setups, spawns) {
  let src = readFileSync(path, 'utf8');
  let changes = 0;

  for (const [marker, px, py, tx, ty] of lineups) {
    const before = src;
    src = replaceCoords(src, marker, 'radarPos', px, py);
    src = replaceCoords(src, marker, 'radarTarget', tx, ty);
    if (src !== before) changes++;
  }

  for (const [marker, x, y] of setups) {
    const before = src;
    src = replaceCoords(src, marker, 'pos', x, y);
    if (src !== before) changes++;
  }

  for (const [marker, x, y] of spawns) {
    const before = src;
    src = replaceCoords(src, marker, 'pos', x, y);
    if (src !== before) changes++;
  }

  writeFileSync(path, src);
  return changes;
}

// ═══════════════════════════════════════════════════════════════
//  ANCIENT   pos_x=-2953 pos_y=2164 scale=5.0
//  t_spawn(32,63) a_site(18,40) b_site(67,31) ct_spawn(42,13)
//  a_main(15,50) b_main(60,46) cave(62,33) elbow(36,27)
//  donut(28,38) lane_corner(58,50) window(38,31) red_room(40,25)
//  a_temple(13,33) b_ramp(69,38) b_short(64,29) b_long(71,34)
// ═══════════════════════════════════════════════════════════════
{
  const n = fixFile('data/ancient.js',
    [
      ['red_room: {',          32, 63,  40, 25],
      ['mid_donut_smoke: {',   36, 55,  28, 38],
      ['a_ct_smoke: {',        15, 50,  23, 31],
      ['a_temple_smoke: {',    15, 50,  13, 33],
      ['a_donut_smoke: {',     15, 50,  28, 38],
      ['ct_from_donut: {',     30, 44,  23, 31],
      ['b_cave_smoke: {',      58, 50,  62, 33],
      ['b_short_smoke: {',     58, 50,  64, 29],
      ['b_long_smoke: {',      58, 50,  71, 34],
      ['b_lurk_smoke: {',      32, 63,  56, 48],
      ['a_main_pop_flash: {',  13, 46,  18, 40],
      ['b_main_pop_flash: {',  60, 46,  67, 31],
      ['ninja_molly: {',       15, 50,  16, 37],
      ['b_pillar_molly: {',    56, 48,  67, 31],
      ['a_site_he: {',         15, 50,  18, 40],
      ['b_ramp_he: {',         60, 46,  69, 38],
      ['ct_elbow_smoke: {',    42, 13,  36, 27],
      ['ct_mid_incendiary: {', 38, 31,  38, 36],
      ['ct_a_main_molly: {',   18, 40,  15, 50],
      ['ct_b_main_molly: {',   67, 31,  60, 46],
      ['ct_a_retake_flash: {', 30, 20,  18, 40],
      ['ct_b_retake_flash: {', 62, 33,  67, 31],
    ],
    [
      ['id: "t_spawn_pillar"',    32, 63],
      ['id: "t_spawn_b_lurk"',    32, 63],
      ['id: "mid_approach"',      36, 55],
      ['id: "a_main_corner"',     15, 50],
      ['id: "a_main_corridor"',   13, 46],
      ['id: "mid_donut_door"',    30, 44],
      ['id: "lane_corner"',       58, 50],
      ['id: "b_main_corridor"',   60, 46],
      ['id: "t_lower_connector"', 56, 48],
      ['id: "ct_spawn_back"',     42, 13],
      ['id: "ct_spawn_near_a"',   30, 20],
      ['id: "window_position"',   38, 31],
      ['id: "a_site_ct"',         18, 40],
      ['id: "b_site_ct"',         67, 31],
      ['id: "cave_rotation"',     62, 33],
    ],
    [
      ['name: "Spawn 1 (Pillar)"',  32, 63],
      ['name: "Spawn 2 (Left)"',    29, 62],
      ['name: "Spawn 3 (Right)"',   35, 64],
      ['name: "Spawn 4 (Back)"',    34, 65],
      ['name: "Spawn 5 (Mid)"',     33, 62],
      ['name: "Spawn 1 (Back CT)"', 42, 13],
      ['name: "Spawn 2 (A Side)"',  38, 12],
      ['name: "Spawn 3 (Mid)"',     44, 14],
      ['name: "Spawn 4 (B Side)"',  46, 12],
      ['name: "Spawn 5 (Close)"',   42, 16],
    ]
  );
  console.log(`ancient: ${n} blocks updated`);
}

// ═══════════════════════════════════════════════════════════════
//  INFERNO   pos_x=-2087 pos_y=3870 scale=4.9
//  t_spawn(10,65) a_site(83,71) b_site(45,20) ct_spawn(87,31)
//  banana_bottom(27,51) banana_top(38,33) mid(40,59) apps(54,59)
//  arch(64,35) library(72,27) pit(66,11) construction(58,21)
// ═══════════════════════════════════════════════════════════════
{
  const n = fixFile('data/inferno.js',
    [
      ['banana_ct_smoke: {',     27, 51,  50, 25],
      ['banana_coffins_smoke: {',38, 33,  42, 22],
      ['b_site_molly: {',        38, 33,  45, 20],
      ['banana_close_molly: {',  27, 51,  30, 45],
      ['banana_flash: {',        27, 51,  35, 40],
      ['a_pit_smoke: {',         54, 59,  66, 11],
      ['a_library_smoke: {',     54, 59,  72, 27],
      ['a_arch_smoke: {',        58, 61,  64, 35],
      ['apps_flash: {',          56, 58,  72, 62],
      ['a_site_molly: {',        60, 62,  80, 68],
      ['mid_smoke: {',           30, 69,  40, 59],
      ['ct_banana_smoke: {',     45, 20,  38, 33],
      ['ct_banana_molly: {',     45, 20,  35, 38],
      ['ct_arch_flash: {',       64, 35,  78, 65],
      ['ct_pit_molly: {',        72, 27,  66, 11],
      ['ct_apps_smoke: {',       80, 68,  60, 60],
      ['ct_b_retake_flash: {',   70, 28,  45, 20],
    ],
    [
      ['id: "bottom_banana"',       27, 51],
      ['id: "banana_right"',        29, 50],
      ['id: "top_banana"',          38, 33],
      ['id: "t_ramp"',              30, 69],
      ['id: "apps_stairs"',         54, 59],
      ['id: "apps_balcony"',        60, 62],
      ['id: "b_site_fountain"',     45, 20],
      ['id: "arch_passage"',        64, 35],
      ['id: "library_back_site"',   72, 27],
      ['id: "a_site_ct"',           80, 68],
      ['id: "ct_spawn_b_rotate"',   87, 31],
    ],
    [
      ['name: "Spawn 1 (Left)"',      8, 64],
      ['name: "Spawn 2 (Right)"',    12, 66],
      ['name: "Spawn 3 (Center)"',   10, 65],
      ['name: "Spawn 4 (Back)"',     11, 67],
      ['name: "Spawn 5 (Ramp)"',     14, 66],
      ['name: "Spawn 1 (Center)"',   87, 31],
      ['name: "Spawn 2 (Library)"',  82, 28],
      ['name: "Spawn 3 (B Side)"',   80, 30],
      ['name: "Spawn 4 (A Side)"',   89, 33],
      ['name: "Spawn 5 (Back)"',     87, 28],
    ]
  );
  console.log(`inferno: ${n} blocks updated`);
}

// ═══════════════════════════════════════════════════════════════
//  DUST2   pos_x=-2476 pos_y=3239 scale=4.4
//  t_spawn(41,98) a_site(82,16) b_site(25,16) ct_spawn(66,11)
//  mid_doors(48,46) long_doors(81,63) long_corner(88,45)
//  a_short(63,25) b_tunnels(21,56) b_window(15,25) pit(93,32)
//  b_car(15,19) catwalk(60,35) lower_mid(43,61)
// ═══════════════════════════════════════════════════════════════
{
  const n = fixFile('data/dust2.js',
    [
      ['xbox_smoke: {',          43, 95,  48, 46],
      ['long_cross_smoke: {',    76, 68,  82, 55],
      ['a_ct_smoke: {',          85, 48,  70, 14],
      ['a_long_flash: {',        78, 63,  85, 48],
      ['ct_molly_from_long: {',  90, 35,  70, 14],
      ['a_short_flash: {',       60, 35,  72, 22],
      ['b_window_smoke: {',      21, 56,  15, 25],
      ['b_car_smoke: {',         21, 56,  15, 19],
      ['b_site_molly: {',        21, 56,  25, 16],
      ['b_tunnel_flash: {',      22, 52,  25, 16],
      ['mid_to_b_smoke: {',      43, 61,  28, 35],
      ['ct_long_doors_smoke: {', 82, 20,  80, 55],
      ['ct_b_tuns_smoke: {',     25, 16,  22, 42],
      ['ct_mid_smoke: {',        66, 11,  48, 46],
      ['ct_b_tuns_molly: {',     25, 16,  22, 42],
      ['ct_a_retake_flash: {',   66, 14,  82, 16],
      ['ct_long_molly: {',       85, 22,  80, 55],
    ],
    [
      ['id: "t_spawn_xbox"',        43, 95],
      ['id: "outside_long_doors"',  76, 68],
      ['id: "a_long_position"',     85, 48],
      ['id: "inside_long_doors"',   78, 63],
      ['id: "catwalk_top"',         60, 35],
      ['id: "upper_b_tunnels"',     21, 56],
      ['id: "lower_mid"',           43, 61],
      ['id: "ct_a_site"',           82, 20],
      ['id: "ct_a_long_corner"',    88, 45],
      ['id: "ct_spawn_mid"',        66, 13],
      ['id: "ct_b_site"',           25, 16],
      ['id: "ct_spawn_a_retake"',   66, 14],
    ],
    [
      ['name: "Spawn 1 (Right Wall)"', 43, 96],
      ['name: "Spawn 2 (Left)"',       39, 97],
      ['name: "Spawn 3 (Center)"',     41, 98],
      ['name: "Spawn 4 (Back)"',       41, 99],
      ['name: "Spawn 5 (Right)"',      44, 97],
      ['name: "Spawn 1 (Mid Side)"',   64, 13],
      ['name: "Spawn 2 (A Side)"',     70, 12],
      ['name: "Spawn 3 (Center)"',     66, 11],
      ['name: "Spawn 4 (B Side)"',     60, 13],
      ['name: "Spawn 5 (Back)"',       66,  9],
    ]
  );
  console.log(`dust2: ${n} blocks updated`);
}

// ═══════════════════════════════════════════════════════════════
//  MIRAGE   pos_x=-3230 pos_y=1713 scale=5.0
//  t_spawn(34,86) a_site(59,57) b_site(20,26) ct_spawn(70,37)
//  mid_window(46,54) palace(58,74) a_ramp(58,40) short(42,44)
//  b_apartments(22,47) b_short(24,34) jungle(65,49) connector(49,42)
//  underpass(32,37)
// ═══════════════════════════════════════════════════════════════
{
  const n = fixFile('data/mirage.js',
    [
      ['window_smoke: {',           34, 84,  46, 54],
      ['jungle_smoke: {',           36, 85,  65, 49],
      ['ct_smoke: {',               34, 86,  70, 37],
      ['stairs_smoke: {',           33, 85,  58, 40],
      ['a_ramp_flash: {',           55, 45,  59, 57],
      ['a_site_molly: {',           58, 42,  62, 55],
      ['short_smoke: {',            42, 58,  42, 44],
      ['b_apartments_smoke: {',     22, 47,  18, 30],
      ['b_short_smoke: {',          22, 47,  24, 34],
      ['b_site_molly: {',           22, 47,  20, 26],
      ['b_apps_flash: {',           22, 47,  20, 26],
      ['ct_a_ramp_smoke: {',        62, 52,  55, 45],
      ['ct_palace_smoke: {',        60, 55,  58, 70],
      ['ct_b_apartments_smoke: {',  20, 28,  22, 42],
      ['ct_b_molly: {',             20, 28,  22, 44],
      ['ct_window_molly: {',        49, 42,  46, 50],
      ['jungle_retake_flash: {',    65, 49,  62, 55],
      ['b_retake_flash: {',         24, 36,  20, 26],
      ['palace_flash: {',           58, 72,  59, 57],
      ['underpass_to_b_smoke: {',   32, 37,  22, 30],
    ],
    [
      ['id: "t_spawn_cart"',       34, 84],
      ['id: "t_spawn_dumpster"',   36, 85],
      ['id: "top_mid"',            42, 58],
      ['id: "a_ramp_corridor"',    55, 45],
      ['id: "palace_exit"',        58, 72],
      ['id: "b_apartments"',       22, 47],
      ['id: "underpass"',          32, 37],
      ['id: "a_site_stairs"',      62, 52],
      ['id: "b_site_pillar"',      20, 28],
      ['id: "connector_ct"',       49, 42],
      ['id: "jungle_ct"',          65, 49],
      ['id: "b_short_ct"',         24, 34],
    ],
    [
      ['name: "Spawn 1 (Cart)"',      34, 84],
      ['name: "Spawn 2 (Dumpster)"',  36, 85],
      ['name: "Spawn 3 (Left)"',      32, 85],
      ['name: "Spawn 4 (Back)"',      35, 88],
      ['name: "Spawn 5 (Right)"',     37, 84],
      ['name: "Spawn 1 (Center)"',    70, 37],
      ['name: "Spawn 2 (A Side)"',    66, 38],
      ['name: "Spawn 3 (B Side)"',    68, 35],
      ['name: "Spawn 4 (Back)"',      70, 35],
      ['name: "Spawn 5 (Market)"',    67, 39],
    ]
  );
  console.log(`mirage: ${n} blocks updated`);
}

// ═══════════════════════════════════════════════════════════════
//  OVERPASS   pos_x=-4831 pos_y=1781 scale=5.2
//  t_spawn(33,69) a_site(63,30) b_site(32,42) ct_spawn(55,18)
//  bathrooms(25,56) monster(43,64) connector(42,45) b_short(40,37)
//  a_long(48,24) playground(51,22) bank(46,32) heaven(31,33)
//  water(34,50)
// ═══════════════════════════════════════════════════════════════
{
  const n = fixFile('data/overpass.js',
    [
      ['bathrooms_b_heaven_smoke: {', 25, 56,  31, 33],
      ['monster_smoke: {',            43, 62,  38, 50],
      ['a_long_smoke: {',             42, 35,  48, 24],
      ['connector_smoke_t: {',        42, 52,  42, 45],
      ['b_site_pop_flash: {',         34, 52,  32, 42],
      ['a_long_molly: {',             42, 35,  48, 24],
      ['bank_smoke: {',               42, 35,  46, 32],
      ['a_site_flash: {',             45, 30,  60, 28],
      ['b_pillar_molly: {',           42, 58,  35, 42],
      ['water_connector_he: {',       34, 50,  42, 45],
      ['playground_smoke: {',         42, 35,  51, 22],
      ['ct_monster_smoke: {',         35, 42,  40, 52],
      ['ct_connector_smoke: {',       48, 38,  42, 45],
      ['ct_long_a_molly: {',          60, 28,  48, 28],
      ['ct_b_short_flash: {',         45, 32,  38, 38],
      ['ct_long_a_smoke: {',          60, 28,  48, 30],
      ['ct_monster_molly: {',         35, 42,  40, 55],
      ['ct_a_retake_flash: {',        55, 18,  60, 28],
      ['ct_water_smoke: {',           36, 42,  34, 50],
    ],
    [
      ['id: "bathrooms_corner"',       25, 56],
      ['id: "monster_stairs"',         43, 64],
      ['id: "monster_exit"',           42, 58],
      ['id: "water_stairs"',           34, 50],
      ['id: "long_a_dumpster"',        42, 35],
      ['id: "long_a_corridor"',        45, 30],
      ['id: "connector_entrance_t"',   42, 52],
      ['id: "b_site_pillar"',          35, 42],
      ['id: "b_site_fountain"',        33, 44],
      ['id: "ct_connector_hold"',      48, 38],
      ['id: "a_site_truck"',           60, 28],
      ['id: "b_short_rotation"',       40, 37],
      ['id: "ct_spawn_a_retake"',      55, 18],
    ],
    [
      ['name: "Spawn 1 (Bathrooms)"',  30, 68],
      ['name: "Spawn 2 (Monster)"',    36, 70],
      ['name: "Spawn 3 (A Long)"',     31, 67],
      ['name: "Spawn 4 (Connector)"',  34, 68],
      ['name: "Spawn 5 (Back)"',       33, 71],
      ['name: "Spawn 1 (Back)"',       55, 18],
      ['name: "Spawn 2 (A site)"',     58, 20],
      ['name: "Spawn 3 (Connector)"',  52, 20],
      ['name: "Spawn 4 (B site)"',     48, 20],
      ['name: "Spawn 5 (Short)"',      50, 19],
    ]
  );
  console.log(`overpass: ${n} blocks updated`);
}

// ═══════════════════════════════════════════════════════════════
//  NUKE   pos_x=-3453 pos_y=2887 scale=7.0
//  t_spawn(54,54) a_site(39,35) outside(57,46) secret(42,66)
//  lobby(47,49) ramp(45,43) hut(44,32) heaven(41,29)
//  ct_spawn(36,28) mini(51,39) trophy(37,42)
// ═══════════════════════════════════════════════════════════════
{
  const n = fixFile('data/nuke.js',
    [
      ['outside_smoke: {',        56, 50,  48, 36],
      ['mini_smoke: {',           56, 50,  51, 39],
      ['outside_heaven_molly: {', 56, 50,  41, 29],
      ['hut_smoke: {',            47, 49,  44, 32],
      ['a_main_pop_flash: {',     44, 48,  39, 38],
      ['ramp_smoke: {',           48, 48,  43, 46],
      ['ramp_sandbags_molly: {',  48, 48,  44, 45],
      ['lobby_pop_flash: {',      47, 49,  45, 45],
      ['ramp_he: {',              48, 48,  44, 45],
      ['ct_outside_smoke: {',     36, 28,  55, 45],
      ['ct_ramp_smoke: {',        42, 46,  46, 48],
      ['trophy_molly: {',         39, 35,  37, 42],
      ['heaven_retake_flash: {',  41, 29,  39, 35],
      ['ct_ramp_molly: {',        42, 46,  46, 48],
      ['ct_b_retake_flash: {',    42, 62,  40, 55],
    ],
    [
      ['id: "t_roof"',               56, 50],
      ['id: "lobby_center"',         47, 49],
      ['id: "squeaky_door"',         44, 48],
      ['id: "t_ramp_top"',           48, 48],
      ['id: "lobby_ramp_entrance"',  47, 48],
      ['id: "ct_spawn"',             36, 28],
      ['id: "heaven_catwalk"',       41, 29],
      ['id: "a_site_ct_defender"',   39, 35],
      ['id: "ramp_ct_side"',         42, 46],
      ['id: "secret_passage"',       42, 62],
    ],
    [
      ['name: "Spawn 1 (Roof Left)"',    53, 51],
      ['name: "Spawn 2 (Roof Right)"',   57, 51],
      ['name: "Spawn 3 (Roof Center)"',  55, 51],
      ['name: "Spawn 4 (Back)"',         55, 55],
      ['name: "Spawn 5 (Lobby)"',        49, 52],
      ['name: "Spawn 1 (Back Left)"',    34, 28],
      ['name: "Spawn 2 (Center)"',       36, 28],
      ['name: "Spawn 3 (Right)"',        38, 28],
      ['name: "Spawn 4 (Back)"',         35, 26],
      ['name: "Spawn 5 (Heaven)"',       40, 28],
    ]
  );
  console.log(`nuke: ${n} blocks updated`);
}

// ═══════════════════════════════════════════════════════════════
//  ANUBIS   pos_x=-2796 pos_y=3328 scale=5.22
//  t_spawn(48,80) a_site(25,40) b_site(72,35) ct_spawn(49,29)
//  a_main(22,62) b_main(69,62) mid(49,64) connector(49,51)
//  canal(62,45) a_heaven(30,36) b_heaven(67,32)
// ═══════════════════════════════════════════════════════════════
{
  const n = fixFile('data/anubis.js',
    [
      ['mid_connector_smoke: {',  48, 76,  49, 51],
      ['mid_flash: {',            48, 74,  49, 60],
      ['a_main_ct_smoke: {',      22, 55,  28, 35],
      ['a_heaven_smoke: {',       22, 55,  30, 36],
      ['a_main_pop_flash: {',     22, 50,  25, 40],
      ['b_main_smoke: {',         69, 55,  67, 35],
      ['b_site_molly: {',         69, 50,  72, 35],
      ['b_main_pop_flash: {',     69, 50,  72, 35],
      ['b_heaven_he: {',          69, 55,  67, 32],
      ['ct_mid_smoke: {',         49, 29,  49, 55],
      ['ct_a_main_smoke: {',      25, 38,  22, 50],
      ['ct_b_main_molly: {',      72, 35,  69, 50],
      ['ct_canal_smoke: {',       49, 32,  62, 45],
      ['ct_a_retake_flash: {',    42, 28,  25, 38],
      ['ct_b_retake_flash: {',    55, 30,  72, 35],
      ['ct_a_main_molly: {',      25, 38,  22, 50],
    ],
    [
      ['id: "t_spawn_mid"',        48, 76],
      ['id: "a_main_corridor"',    22, 55],
      ['id: "b_main_corridor"',    69, 55],
      ['id: "ct_spawn_back"',      49, 29],
      ['id: "a_site_ct"',          25, 38],
      ['id: "b_site_ct"',          72, 35],
      ['id: "ct_near_a"',          38, 28],
      ['id: "ct_connector"',       49, 40],
    ],
    [
      ['name: "Spawn 1 (Mid pillar)"',  48, 76],
      ['name: "Spawn 2 (Left)"',        45, 78],
      ['name: "Spawn 3 (Right)"',       51, 79],
      ['name: "Spawn 4 (Back)"',        49, 81],
      ['name: "Spawn 5 (A side)"',      44, 78],
      ['name: "Spawn 1 (Back mid)"',    49, 26],
      ['name: "Spawn 2 (A side)"',      38, 28],
      ['name: "Spawn 3 (Center)"',      49, 28],
      ['name: "Spawn 4 (B side)"',      58, 28],
      ['name: "Spawn 5 (Connector)"',   53, 30],
    ]
  );
  console.log(`anubis: ${n} blocks updated`);
}

// ═══════════════════════════════════════════════════════════════
//  CACHE   pos_x=-2000 pos_y=3250 scale=5.5
//  t_spawn(36,72) a_site(25,33) b_site(57,61) ct_spawn(43,24)
//  mid(39,51) a_main(21,47) b_main(52,68) highway(30,28)
//  squeaky(21,38) z_connector(44,54) b_heaven(52,54)
//  b_checkers(60,58) sunroom(59,65) garage(39,65)
// ═══════════════════════════════════════════════════════════════
{
  const n = fixFile('data/cache.js',
    [
      ['t_z_connector_smoke: {',         36, 70,  44, 54],
      ['t_criss_cross_smoke_left: {',    38, 58,  38, 48],
      ['t_criss_cross_smoke_right: {',   38, 58,  42, 48],
      ['ct_mid_delay_smoke: {',          43, 30,  39, 48],
      ['t_boost_molly: {',               39, 56,  40, 48],
      ['t_a_cross_smoke: {',             22, 50,  22, 40],
      ['t_back_a_site_smoke: {',         22, 48,  28, 30],
      ['t_highway_smoke: {',             22, 48,  30, 28],
      ['t_forklift_molly: {',            22, 48,  23, 35],
      ['t_a_main_flash: {',              21, 47,  25, 35],
      ['ct_a_main_molly_toxic: {',       25, 33,  21, 45],
      ['ct_a_main_smoke_truck: {',       24, 32,  21, 45],
      ['t_b_heaven_smoke: {',            52, 66,  52, 54],
      ['t_b_tree_smoke: {',              52, 66,  55, 58],
      ['t_b_main_smoke: {',              52, 66,  55, 64],
      ['t_b_main_molly: {',              52, 66,  55, 63],
      ['t_b_sunroom_flash: {',           55, 66,  59, 65],
      ['t_b_site_default_molly: {',      55, 64,  57, 61],
      ['t_b_headshot_molly: {',          55, 64,  55, 58],
      ['ct_b_main_anti_rush_molly: {',   57, 61,  52, 66],
      ['ct_b_main_smoke: {',             57, 61,  52, 66],
      ['ct_b_checkers_flash: {',         60, 58,  57, 62],
    ],
    [
      ['id: "t_spawn_z"',            36, 70],
      ['id: "a_main_entrance"',      21, 47],
      ['id: "a_forklift"',           23, 35],
      ['id: "b_main_entrance"',      52, 66],
      ['id: "b_sunroom"',            59, 65],
      ['id: "ct_mid_connector"',     43, 40],
      ['id: "ct_a_truck"',           24, 32],
      ['id: "ct_b_checkers"',        60, 58],
    ],
    [
      ['name: "Spawn 1 (Line 3)"',  36, 70],
      ['name: "Spawn 2 (Left)"',    34, 71],
      ['name: "Spawn 3 (Right)"',   38, 71],
      ['name: "Spawn 4 (Back)"',    36, 73],
      ['name: "Spawn 5 (A side)"',  33, 70],
      ['name: "Spawn 1 (Mid)"',     44, 28],
      ['name: "Spawn 2 (A)"',       38, 26],
      ['name: "Spawn 3 (Center)"',  43, 26],
      ['name: "Spawn 4 (B)"',       48, 28],
      ['name: "Spawn 5 (Back)"',    43, 22],
    ]
  );
  console.log(`cache: ${n} blocks updated`);
}

console.log('\nDone. Run tests: npx vitest run');
