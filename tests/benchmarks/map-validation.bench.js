import { bench, describe } from "vitest";
import MAPS from "../../data/maps.js";
import { validateAllMaps, validateMapModule } from "../validateMapData.js";

describe("map validation benchmark", () => {
  bench("validate all maps (full registry)", () => {
    validateAllMaps(MAPS);
  });

  bench("validate single map (ancient)", () => {
    validateMapModule(MAPS.ancient.module, "ancient");
  });
});
