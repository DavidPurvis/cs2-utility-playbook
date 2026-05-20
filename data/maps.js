/**
 * Public map API for the app (metadata + lazy loaders).
 * Tests and scripts should import from maps-registry.js for eager validation.
 */

export {
  BONUS_MAP_IDS,
  getMapLabel,
  MAP_IDS,
  MAP_LIST,
  PREMIER_MAP_IDS,
  WIP_MAP_IDS,
} from "./mapMeta.js";

export { loadMapModule } from "./loadMapModule.js";
