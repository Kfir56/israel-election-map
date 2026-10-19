// Builds src/data/israel-outline.json from Natural Earth (world-atlas 50m).
// Output: one ring of [x, y] points, scaled so the shape is ~10 units tall.
import { readFileSync, writeFileSync } from "node:fs";
import { feature } from "topojson-client";

const world = JSON.parse(readFileSync("node_modules/world-atlas/countries-50m.json", "utf8"));
const israel = feature(world, world.objects.countries).features.find((f) => f.id === "376");
const polys = israel.geometry.type === "Polygon" ? [israel.geometry.coordinates] : israel.geometry.coordinates;
// Keep the largest ring (mainland).
const ring = polys.map((p) => p[0]).sort((a, b) => b.length - a.length)[0];

const lat0 = 31.5;
const k = Math.cos((lat0 * Math.PI) / 180);
const pts = ring.map(([lon, lat]) => [lon * k, lat]);
const xs = pts.map((p) => p[0]);
const ys = pts.map((p) => p[1]);
const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
const scale = 10 / (Math.max(...ys) - Math.min(...ys));
const out = pts.map(([x, y]) => [+((x - cx) * scale).toFixed(3), +((y - cy) * scale).toFixed(3)]);

writeFileSync("src/data/israel-outline.json", JSON.stringify(out));
console.log(`points: ${out.length}`);
