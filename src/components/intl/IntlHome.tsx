import Link from "next/link";
import BallotLetter from "@/components/BallotLetter";
import { type Locale, base, content, fill, forward } from "@/data/intl";
import minorLists from "@/data/minor-lists.json";
import { parties } from "@/data/parties";
import { averageSeats, polls } from "@/data/polls";
import { colorOnDark } from "@/lib/party-color";

export default function IntlHome({ locale }: { locale: Locale }) {
  const c = content[locale];
  const t = c.ui;
  const b = base(locale);
  const ordered = [...parties].sort((a, b) => (averageSeats[b.id] ?? 0) - (averageSeats[a.id] ?? 0));
  const max = Math.max(...Object.values(averageSeats));
  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <h1 className="text-3xl font-extrabold sm:text-4xl">{t.homeTitle}</h1>
      <p className="mt-2 text-lg text-slate-300">{t.homeIntro}</p>

      <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:p-5">
        <h2 className="text-xl font-bold">{t.seatsTitle}</h2>
        <p className="mt-1 text-sm text-slate-400">{fill(t.seatsSub, { n: polls.length })}</p>
        <ul className="mt-4 space-y-1.5">
          {ordered
            .filter((p) => averageSeats[p.id])
            .map((p) => (
              <li key={p.id}>
                <Link href={`${b}/party/${p.id}`} className="group flex items-center gap-3">
                  <span className="w-40 shrink-0 truncate text-sm group-hover:text-sky-300">
                    {c.parties[p.id].name}
                  </span>
                  <span className="h-4 flex-1">
                    <span
                      className="block h-full rounded-e"
                      style={{ width: `${(averageSeats[p.id] / max) * 100}%`, background: colorOnDark(p.id) }}
                    />
                  </span>
                  <span className="w-6 text-sm font-bold tabular-nums">{averageSeats[p.id]}</span>
                </Link>
              </li>
            ))}
        </ul>
      </section>

      <h2 className="mt-10 text-2xl font-bold">{t.partiesTitle}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {ordered.map((p) => {
          const pt = c.parties[p.id];
          return (
            <Link
              key={p.id}
              href={`${b}/party/${p.id}`}
              className="flex gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4 transition hover:border-sky-500/60"
            >
              <BallotLetter letter={p.letter} size="sm" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2 font-bold">
                  {pt.name}
                  <span className="text-sm font-normal text-slate-500">
                    {p.withdrawn ? t.withdrawnShort : fill(t.avgSeats, { n: averageSeats[p.id] ?? 0 })}
                  </span>
                </div>
                <div className="text-sm text-slate-400">{fill(t.ledBy, { name: pt.leader })}</div>
                <p className="mt-1 line-clamp-2 text-sm text-slate-300">{pt.summary}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">{fill(t.minorTitle, { n: minorLists.length })}</h2>
        <p className="mt-1 text-slate-400">{t.minorText}</p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {minorLists.map((l) => {
            const m = c.minor[l.letter];
            return (
              <li key={l.letter} className="flex gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-3 text-sm">
                <BallotLetter letter={l.letter} size="sm" />
                <div className="min-w-0">
                  <div className="font-semibold">{m?.name ?? l.name}</div>
                  {m?.head && <div className="text-xs text-slate-500">{fill(t.ledBy, { name: m.head })}</div>}
                  {m?.description && <p className="mt-1 text-slate-400">{m.description}</p>}
                  <a href={l.source} target="_blank" rel="noreferrer" className="text-xs text-sky-400 hover:underline">
                    {t.source}
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        <Link
          href={`${b}/towns`}
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 hover:border-sky-500/60"
        >
          <div className="font-semibold text-sky-300">
            {t.townsCardTitle} {forward(locale)}
          </div>
          <p className="mt-1 text-sm text-slate-400">{t.townsCardText}</p>
        </Link>
        <Link
          href={`${b}/why-vote`}
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 hover:border-sky-500/60"
        >
          <div className="font-semibold text-sky-300">
            {t.whyCardTitle} {forward(locale)}
          </div>
          <p className="mt-1 text-sm text-slate-400">{t.whyCardText}</p>
        </Link>
      </div>
    </main>
  );
}
