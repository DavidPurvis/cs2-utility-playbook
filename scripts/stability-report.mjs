#!/usr/bin/env node
/**
 * Print JSON stability metrics for CI dashboards or local inspection.
 * Usage: npm run test:metrics
 */
import MAPS from "../data/maps-registry.js";
import { buildStabilityReport } from "../tests/helpers/stabilityMetrics.js";

const report = buildStabilityReport(MAPS);
console.log(JSON.stringify(report, null, 2));
