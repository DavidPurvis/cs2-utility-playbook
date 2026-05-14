/*
  MAP REGISTRY — all Premier map pool maps.
  Import this in the main component to populate the map selector.
*/

import * as ancient  from "./ancient.js";
import * as dust2    from "./dust2.js";
import * as inferno  from "./inferno.js";
import * as mirage   from "./mirage.js";
import * as nuke     from "./nuke.js";
import * as anubis   from "./anubis.js";
import * as overpass from "./overpass.js";

const MAPS = {
  ancient:  { id: "ancient",  label: "Ancient",  module: ancient },
  dust2:    { id: "dust2",    label: "Dust II",   module: dust2 },
  inferno:  { id: "inferno",  label: "Inferno",   module: inferno },
  mirage:   { id: "mirage",   label: "Mirage",    module: mirage },
  nuke:     { id: "nuke",     label: "Nuke",      module: nuke },
  anubis:   { id: "anubis",   label: "Anubis",    module: anubis },
  overpass: { id: "overpass", label: "Overpass",  module: overpass },
};

export const MAP_LIST = Object.values(MAPS);
export const MAP_IDS  = Object.keys(MAPS);
export default MAPS;
