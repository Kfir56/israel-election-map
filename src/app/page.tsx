import { KNESSET_SEATS, parties } from "@/data/parties";

export default function Home() {
  const total = parties.reduce((sum, p) => sum + p.seats25, 0);

  return (
    <main className="mx-auto max-w-3xl p-6 sm:p-10">
      <h1 className="text-3xl font-bold">Israel Election Map 2026</h1>
      <p className="mt-2 text-sm opacity-70">
        Knesset election, 27 October 2026. The 3D map, live results and seat
        predictions are coming. Seats below are from the outgoing Knesset.
      </p>

      <div className="mt-8 flex h-6 w-full overflow-hidden rounded">
        {parties.map((p) => (
          <div
            key={p.id}
            title={`${p.name}: ${p.seats25}`}
            style={{ width: `${(p.seats25 / KNESSET_SEATS) * 100}%`, background: p.color }}
          />
        ))}
      </div>

      <ul className="mt-6 grid gap-2 sm:grid-cols-2">
        {parties.map((p) => (
          <li key={p.id} className="flex items-center justify-between rounded border border-black/10 px-3 py-2 dark:border-white/15">
            <span className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full" style={{ background: p.color }} />
              {p.name} <span className="opacity-60">{p.nameHe}</span>
            </span>
            <span className="font-mono">{p.seats25}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs opacity-60">Total: {total}/{KNESSET_SEATS}</p>
    </main>
  );
}
