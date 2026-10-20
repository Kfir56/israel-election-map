import Link from "next/link";
import { notFound } from "next/navigation";
import BallotLetter from "@/components/BallotLetter";
import CutoffLine from "@/components/CutoffLine";
import { coalitionLines } from "@/data/coalitions";
import { type Locale, back, base, content, fill, intlDate } from "@/data/intl";
import { categories, parties, positionSources } from "@/data/parties";
import { averageSeats, partyRange, polls } from "@/data/polls";

export default function IntlParty({ locale, id }: { locale: Locale; id: string }) {
  const c = content[locale];
  const t = c.ui;
  const party = parties.find((p) => p.id === id);
  const pt = c.parties[id];
  if (!party || !pt) notFound();
  const range = partyRange(id);
  const rangeText = range.min === range.max ? `${range.max}` : `${range.min}–${range.max}`;
  const lines = coalitionLines[id];
  const tl = c.coalition[id];
  const seats = averageSeats[id] ?? 0;
  // Only the names we translated (the top of each list); the rest link to the Hebrew list.
  const shown = party.candidates.filter((cand) => pt.candidates[String(cand.pos)]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <Link href={base(locale)} className="text-sm text-slate-400 hover:text-sky-300">
        {back(locale)} {t.allParties}
      </Link>

      <header className="mt-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
        <div className="h-2" style={{ background: party.color }} />
        <div className="p-5 sm:p-7">
          <div className="text-xs text-slate-400">{c.blocs[party.bloc]}</div>
          <div className="mt-1 flex items-center gap-4">
            <h1 className="text-4xl font-extrabold">{pt.name}</h1>
            <div className="flex flex-col items-center gap-0.5">
              <BallotLetter letter={party.letter} />
              <span className="text-[10px] text-slate-500">{t.ballotNote}</span>
            </div>
          </div>
          <p className="mt-2 text-slate-300">{fill(t.ledBy, { name: pt.leader })}</p>
          {party.withdrawn && pt.withdrawn && (
            <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-100">
              <b>{t.withdrawnBold}</b> {pt.withdrawn}{" "}
              <a href={party.withdrawn.source} target="_blank" rel="noreferrer" className="underline">
                {fill(t.sourceDate, { label: t.source, date: intlDate(party.withdrawn.date) })}
              </a>
            </div>
          )}
          <p className="mt-4 text-slate-300">{pt.summary}</p>
          <div className="mt-5 grid grid-cols-2 gap-2 text-center">
            <Stat label={fill(t.statAvg, { n: polls.length })} value={seats ? `${seats}` : t.belowThreshold} />
            <Stat label={t.statRange} value={rangeText} />
          </div>
        </div>
      </header>

      <section className="mt-8">
        <h2 className="text-2xl font-bold">{t.positionsTitle}</h2>
        <div className="mt-3 space-y-3">
          {categories.map((cat) => {
            const src = positionSources[id]?.[cat.id];
            return (
              <div key={cat.id} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                <h3 className="font-semibold text-sky-300">{c.categories[cat.id]}</h3>
                {pt.topics[cat.id] ? (
                  <p className="mt-1 text-slate-300">
                    {pt.topics[cat.id]}{" "}
                    {src && <Src locale={locale} href={src.source} date={src.date} label={pt.sourceLabels[cat.id]} />}
                  </p>
                ) : (
                  <p className="mt-1 text-slate-500">{t.noPosition}</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {lines && tl && (lines.recommends || lines.wontSitWith.length > 0 || lines.conditions.length > 0) && (
        <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <h2 className="text-2xl font-bold">{t.coalitionTitle}</h2>
          <dl className="mt-2 space-y-2 text-sm text-slate-300">
            {lines.recommends && tl.recommends && (
              <div>
                <dt className="text-xs text-slate-500">{t.recommends}</dt>
                <dd>
                  {tl.recommends} <Src locale={locale} href={lines.recommends.source} date={lines.recommends.date} />
                </dd>
              </div>
            )}
            {lines.wontSitWith.length > 0 && (
              <div>
                <dt className="text-xs text-rose-300">{t.wontSitWith}</dt>
                {lines.wontSitWith.map((w, i) => (
                  <dd key={i}>
                    <b>{c.parties[w.party]?.name}</b>
                    {tl.wontSitWithNotes[i] && (
                      <span className="text-slate-500"> ({tl.wontSitWithNotes[i]})</span>
                    )}: {tl.wontSitWith[i]} <Src locale={locale} href={w.source} date={w.date} />
                  </dd>
                ))}
              </div>
            )}
            {lines.conditions.length > 0 && (
              <div>
                <dt className="text-xs text-amber-300">{t.conditions}</dt>
                {lines.conditions.map((cond, i) => (
                  <dd key={i}>
                    {tl.conditions[i]} <Src locale={locale} href={cond.source} date={cond.date} />
                  </dd>
                ))}
              </div>
            )}
          </dl>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-2xl font-bold">{t.listTitle}</h2>
        <ol className="mt-3 grid gap-2 sm:grid-cols-2">
          {shown.map((cand) => {
            const a = pt.candidates[String(cand.pos)];
            return [
              <li
                key={cand.pos}
                className={`flex gap-3 rounded-lg border border-slate-800 p-3 text-sm ${
                  seats && cand.pos > seats ? "bg-slate-950 opacity-60" : "bg-slate-900/40"
                }`}
              >
                <span className="w-6 shrink-0 font-bold tabular-nums text-slate-500">{cand.pos}</span>
                <div>
                  <div className="font-semibold">{a?.name ?? cand.name}</div>
                  {a?.note && <div className="text-xs text-slate-400">{a.note}</div>}
                </div>
              </li>,
              seats > 0 && cand.pos === seats && cand.pos < shown.length && (
                <CutoffLine key="cutoff" label={fill(t.cutoffLine, { n: seats })} />
              ),
            ];
          })}
        </ol>
        {seats > 0 && <p className="mt-2 text-xs text-slate-400">{fill(t.cutoffNote, { range: rangeText })}</p>}
        <p className="mt-2 text-xs text-slate-500">
          {t.fullListBefore}{" "}
          <a href={party.listSource} target="_blank" rel="noreferrer" className="underline">
            {t.fullListLink}
          </a>
          .
        </p>
      </section>
    </main>
  );
}

function Src({ href, date, label, locale }: { href: string; date: string; label?: string; locale: Locale }) {
  const t = content[locale].ui;
  return (
    <a href={href} target="_blank" rel="noreferrer" className="whitespace-nowrap text-xs text-sky-400 hover:underline">
      {fill(t.sourceDate, { label: label ?? t.source, date: intlDate(date) })}
    </a>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-950/50 p-3">
      <div className="text-2xl font-extrabold">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}
