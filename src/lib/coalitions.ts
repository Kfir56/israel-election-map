// Every "minimal winning" coalition: at least 61 seats, and dropping any one
// party takes it below 61. Bigger coalitions are these plus extras, so listing
// the minimal ones shows every real option without repeating it.
export function minimalCoalitions(seats: Record<string, number>, majority = 61): string[][] {
  const ids = Object.keys(seats).filter((id) => seats[id] > 0);
  const out: string[][] = [];
  for (let mask = 1; mask < 1 << ids.length; mask++) {
    const members = ids.filter((_, i) => mask & (1 << i));
    const total = members.reduce((n, id) => n + seats[id], 0);
    if (total < majority) continue;
    if (members.every((id) => total - seats[id] < majority)) out.push(members);
  }
  return out;
}

export type Conflict = { a: string; b: string; text: string; source: string; date: string };

/** The stated red lines a coalition would break. */
export function conflictsIn(members: string[], conflicts: Conflict[]): Conflict[] {
  const set = new Set(members);
  return conflicts.filter((c) => set.has(c.a) && set.has(c.b));
}
