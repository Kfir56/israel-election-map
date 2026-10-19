import meta from "@/data/terrain-meta.json";
import transform from "@/data/map-transform.json";

// Elevation grid built by scripts/make-terrain.mjs.
export type Terrain = {
  w: number;
  h: number;
  heights: Int16Array;
  // 0 = outside Israel, 1 = Israel, 2 = sea or lake
  kind: Uint8Array;
};

export const CELL_OUTSIDE = 0;
export const CELL_ISRAEL = 1;
export const CELL_WATER = 2;

// Metres to scene units. Real relief is ~25x exaggerated so the hills read.
export const VERTICAL_SCALE = 0.00058;

// Map plane (x east, y north), in the same units as the outline and layout.
export function lonLatToMap(lon: number, lat: number): [number, number] {
  return [(lon * transform.k - transform.cx) * transform.scale, (lat - transform.cy) * transform.scale];
}

export function mapToLonLat(x: number, y: number): [number, number] {
  return [(x / transform.scale + transform.cx) / transform.k, y / transform.scale + transform.cy];
}

export const extent = (() => {
  const [x0, y0] = lonLatToMap(meta.lon0, meta.lat0);
  const [x1, y1] = lonLatToMap(meta.lon1, meta.lat1);
  return { x0, y0, x1, y1 };
})();

export async function loadTerrain(): Promise<Terrain> {
  const buf = await (await fetch("/terrain.bin")).arrayBuffer();
  const n = meta.w * meta.h;
  return {
    w: meta.w,
    h: meta.h,
    heights: new Int16Array(buf, 0, n),
    kind: new Uint8Array(buf, n * 2, n),
  };
}

// Displayed height (scene units) of a cell: water is flattened to its surface.
export function cellHeight(t: Terrain, i: number): number {
  const m = t.heights[i];
  if (t.kind[i] === CELL_WATER) {
    if (m < -390) return -415 * VERTICAL_SCALE; // Dead Sea surface
    if (m < -150) return -212 * VERTICAL_SCALE; // Kinneret surface
    return 0;
  }
  return m * VERTICAL_SCALE;
}

// Bilinear height at a point on the map plane.
export function sampleHeight(t: Terrain, x: number, y: number): number {
  const u = ((x - extent.x0) / (extent.x1 - extent.x0)) * (t.w - 1);
  const v = ((extent.y1 - y) / (extent.y1 - extent.y0)) * (t.h - 1);
  const c0 = Math.max(0, Math.min(t.w - 2, Math.floor(u)));
  const r0 = Math.max(0, Math.min(t.h - 2, Math.floor(v)));
  const fu = Math.min(1, Math.max(0, u - c0));
  const fv = Math.min(1, Math.max(0, v - r0));
  const at = (r: number, c: number) => cellHeight(t, r * t.w + c);
  const top = at(r0, c0) * (1 - fu) + at(r0, c0 + 1) * fu;
  const bottom = at(r0 + 1, c0) * (1 - fu) + at(r0 + 1, c0 + 1) * fu;
  return top * (1 - fv) + bottom * fv;
}
