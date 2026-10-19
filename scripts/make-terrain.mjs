// Builds public/terrain.bin from AWS Terrain Tiles (terrarium encoding).
// Layout: Int16 heights in metres (W*H, row 0 = north), then Uint8 kind per
// cell: 0 = outside Israel, 1 = Israel, 2 = sea or lake.
// Grid metadata goes to src/data/terrain-meta.json.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { PNG } from "pngjs";

const Z = 9;
const LON0 = 34.15, LON1 = 35.95, LAT0 = 29.4, LAT1 = 33.45;
const W = 256;
const k = Math.cos((31.5 * Math.PI) / 180);
const H = Math.round((W * (LAT1 - LAT0)) / ((LON1 - LON0) * k));
const CACHE = "scripts/.tiles";

const tileX = (lon) => ((lon + 180) / 360) * 2 ** Z;
const tileY = (lat) => {
  const r = (lat * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** Z;
};

mkdirSync(CACHE, { recursive: true });
const tiles = new Map();
async function tile(x, y) {
  const key = `${x}/${y}`;
  if (tiles.has(key)) return tiles.get(key);
  const file = `${CACHE}/${Z}-${x}-${y}.png`;
  if (!existsSync(file)) {
    const res = await fetch(`https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${Z}/${x}/${y}.png`);
    if (!res.ok) throw new Error(`tile ${key}: ${res.status}`);
    writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  const png = PNG.sync.read(readFileSync(file));
  tiles.set(key, png);
  return png;
}

async function elevation(lon, lat) {
  const fx = tileX(lon), fy = tileY(lat);
  const png = await tile(Math.floor(fx), Math.floor(fy));
  const px = Math.min(255, Math.floor((fx % 1) * 256));
  const py = Math.min(255, Math.floor((fy % 1) * 256));
  const i = (py * 256 + px) * 4;
  return png.data[i] * 256 + png.data[i + 1] + png.data[i + 2] / 256 - 32768;
}

const ring = JSON.parse(readFileSync("scripts/israel-lonlat.json", "utf8"));
function inIsrael(lon, lat) {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

function isWater(lon, lat, h) {
  if (h <= 0 && lon < 35.3 && lat > 31.2) return true; // Mediterranean
  if (h <= 0 && lon < 34.4) return true; // Mediterranean, south (Gaza coast)
  if (h < -395 && lat > 31.0 && lat < 31.8) return true; // Dead Sea (north basin)
  if (h < -205 && lat > 32.68 && lat < 32.92 && lon > 35.5 && lon < 35.68) return true; // Kinneret
  if (h <= 2 && lat < 29.6 && lon > 34.85) return true; // Gulf of Eilat
  return false;
}

const heights = new Int16Array(W * H);
const kind = new Uint8Array(W * H);
for (let r = 0; r < H; r++) {
  const lat = LAT1 - ((r + 0.5) / H) * (LAT1 - LAT0);
  for (let c = 0; c < W; c++) {
    const lon = LON0 + ((c + 0.5) / W) * (LON1 - LON0);
    const h = await elevation(lon, lat);
    const i = r * W + c;
    heights[i] = Math.round(h);
    kind[i] = isWater(lon, lat, h) ? 2 : inIsrael(lon, lat) ? 1 : 0;
  }
}

mkdirSync("public", { recursive: true });
writeFileSync("public/terrain.bin", Buffer.concat([Buffer.from(heights.buffer), Buffer.from(kind.buffer)]));
writeFileSync("src/data/terrain-meta.json", JSON.stringify({ w: W, h: H, lon0: LON0, lon1: LON1, lat0: LAT0, lat1: LAT1 }));
let min = Infinity, max = -Infinity;
for (const v of heights) { min = Math.min(min, v); max = Math.max(max, v); }
console.log(`grid ${W}x${H}, tiles ${tiles.size}, height ${min}..${max} m`);
