import outline from "@/data/israel-outline.json";
import type { Party } from "@/data/parties";

export type Point = [number, number];
export const ring = outline as Point[];

const xs = ring.map((p) => p[0]);
const ys = ring.map((p) => p[1]);
export const bounds = {
  minX: Math.min(...xs),
  maxX: Math.max(...xs),
  minY: Math.min(...ys),
  maxY: Math.max(...ys),
};

export function inside([x, y]: Point): boolean {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

// Distance from p to the outline; used to keep pillars away from the edge.
function edgeDistance([x, y]: Point): number {
  let best = Infinity;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [ax, ay] = ring[j];
    const [bx, by] = ring[i];
    const dx = bx - ax;
    const dy = by - ay;
    if (dx === 0 && dy === 0) continue;
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)));
    best = Math.min(best, Math.hypot(x - (ax + t * dx), y - (ay + t * dy)));
  }
  return best;
}

// Grid of valid spots inside the shape, at least `margin` from the edge.
function slots(margin: number, step: number): Point[] {
  const out: Point[] = [];
  for (let x = bounds.minX; x <= bounds.maxX; x += step) {
    for (let y = bounds.minY; y <= bounds.maxY; y += step) {
      const p: Point = [x, y];
      if (inside(p) && edgeDistance(p) >= margin) out.push(p);
    }
  }
  return out;
}

// Places each party on the map: x follows the left–right axis, y follows the
// secular–religious axis. Each party takes the free spot nearest its target,
// biggest parties first, so pillars never overlap. The narrow middle of the
// country pushes parties north or south rather than sideways.
export function placeParties(parties: Party[]): Record<string, Point> {
  const free = slots(0.18, 0.2);
  const gap = 0.52;
  const taken: Point[] = [];
  const result: Record<string, Point> = {};
  const yLow = -2.2;
  const yHigh = 4.2;

  for (const p of [...parties].sort((a, b) => b.poll - a.poll)) {
    const target: Point = [
      bounds.minX + p.spectrum.right * (bounds.maxX - bounds.minX),
      yLow + p.spectrum.religious * (yHigh - yLow),
    ];
    let best: Point = free[0];
    let bestD = Infinity;
    for (const s of free) {
      if (taken.some((t) => Math.hypot(t[0] - s[0], t[1] - s[1]) < gap)) continue;
      // Left–right is the main message, so horizontal error costs more.
      const d = Math.hypot(3 * (s[0] - target[0]), s[1] - target[1]);
      if (d < bestD) {
        bestD = d;
        best = s;
      }
    }
    taken.push(best);
    result[p.id] = best;
  }
  return result;
}
