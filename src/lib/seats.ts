// Knesset seat allocation: the 3.25% threshold, then the Bader-Ofer method
// (largest average) with surplus-vote agreements between pairs of lists.

export const THRESHOLD_PCT = 3.25;

export type Allocation = {
  seats: Record<string, number>;
  qualified: string[];
  /** Votes (in the same unit as the input) worth one seat. */
  quota: number;
  /** Seats handed out in the first, whole-quota round. */
  firstRound: number;
  /** Order in which the leftover seats went, by list or pair. */
  leftovers: string[];
};

function largestAverage(votes: Record<string, number>, seats: Record<string, number>, count: number, order?: string[]) {
  for (let i = 0; i < count; i++) {
    let best = "";
    let bestAvg = -1;
    for (const [id, v] of Object.entries(votes)) {
      const avg = v / ((seats[id] ?? 0) + 1);
      if (avg > bestAvg) {
        bestAvg = avg;
        best = id;
      }
    }
    seats[best] = (seats[best] ?? 0) + 1;
    order?.push(best);
  }
}

/**
 * `votes` can be raw votes or percentages of all valid votes (including lists
 * that won't pass). `pairs` are surplus agreements; a pair only counts when
 * both lists pass the threshold.
 */
export function allocate(votes: Record<string, number>, totalValid: number, pairs: [string, string][] = [], seatsTotal = 120): Allocation {
  const qualified = Object.keys(votes).filter((id) => votes[id] >= (totalValid * THRESHOLD_PCT) / 100);
  const qualifiedVotes = qualified.reduce((s, id) => s + votes[id], 0);
  const quota = qualifiedVotes / seatsTotal;
  const seats: Record<string, number> = {};
  for (const id of qualified) seats[id] = Math.floor(votes[id] / quota);
  const firstRound = Object.values(seats).reduce((a, b) => a + b, 0);

  // Leftover seats: pairs compete as one list.
  const activePairs = pairs.filter(([a, b]) => qualified.includes(a) && qualified.includes(b));
  const inPair = new Map<string, string>();
  const entityVotes: Record<string, number> = {};
  const entitySeats: Record<string, number> = {};
  for (const [a, b] of activePairs) {
    const key = `${a}+${b}`;
    inPair.set(a, key);
    inPair.set(b, key);
    entityVotes[key] = votes[a] + votes[b];
    entitySeats[key] = seats[a] + seats[b];
  }
  for (const id of qualified)
    if (!inPair.has(id)) {
      entityVotes[id] = votes[id];
      entitySeats[id] = seats[id];
    }
  const leftovers: string[] = [];
  largestAverage(entityVotes, entitySeats, seatsTotal - firstRound, leftovers);

  // Split each pair's seats between its two lists the same way.
  for (const [a, b] of activePairs) {
    const total = entitySeats[`${a}+${b}`];
    const pairQuota = (votes[a] + votes[b]) / total;
    const inner: Record<string, number> = { [a]: Math.floor(votes[a] / pairQuota), [b]: Math.floor(votes[b] / pairQuota) };
    largestAverage({ [a]: votes[a], [b]: votes[b] }, inner, total - inner[a] - inner[b]);
    seats[a] = inner[a];
    seats[b] = inner[b];
  }
  for (const id of qualified) if (!inPair.has(id)) seats[id] = entitySeats[id];

  return { seats, qualified, quota, firstRound, leftovers };
}
