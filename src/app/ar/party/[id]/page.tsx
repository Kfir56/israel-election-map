import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BallotLetter from "@/components/BallotLetter";
import { ar, arDate } from "@/data/ar";
import { coalitionLines } from "@/data/coalitions";
import { categories, parties, positionSources } from "@/data/parties";
import { averageSeats, partyRange, polls } from "@/data/polls";

export function generateStaticParams() {
  return parties.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `${ar.parties[id]?.name ?? ""} · الخريطة السياسية 2026` };
}

function Src({ href, date, label }: { href: string; date: string; label?: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="whitespace-nowrap text-xs text-sky-400 hover:underline">
      {label ?? "المصدر"}، {arDate(date)}
    </a>
  );
}

export default async function ArabicPartyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const party = parties.find((p) => p.id === id);
  const t = ar.parties[id];
  if (!party || !t) notFound();
  const range = partyRange(id);
  const lines = coalitionLines[id];
  const arLines = ar.coalition[id];

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <Link href="/ar" className="text-sm text-slate-400 hover:text-sky-300">
        → كل الأحزاب
      </Link>

      <header className="mt-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
        <div className="h-2" style={{ background: party.color }} />
        <div className="p-5 sm:p-7">
          <div className="text-xs text-slate-400">{ar.blocs[party.bloc]}</div>
          <div className="mt-1 flex items-center gap-4">
            <h1 className="text-4xl font-extrabold">{t.name}</h1>
            <div className="flex flex-col items-center gap-0.5">
              <BallotLetter letter={party.letter} />
              <span className="text-[10px] text-slate-500">الورقة في الصندوق</span>
            </div>
          </div>
          <p className="mt-2 text-slate-300">برئاسة {t.leader}</p>
          {party.withdrawn && t.withdrawn && (
            <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-100">
              <b>انسحب الحزب من السباق.</b> {t.withdrawn}{" "}
              <a href={party.withdrawn.source} target="_blank" rel="noreferrer" className="underline">
                المصدر، {arDate(party.withdrawn.date)}
              </a>
            </div>
          )}
          <p className="mt-4 text-slate-300">{t.summary}</p>
          <div className="mt-5 grid grid-cols-2 gap-2 text-center">
            <Stat label={`معدّل ${polls.length} استطلاعًا`} value={averageSeats[id] ? `${averageSeats[id]}` : "تحت نسبة الحسم"} />
            <Stat label="المدى في الاستطلاعات" value={range.min === range.max ? `${range.max}` : `${range.min}–${range.max}`} />
          </div>
        </div>
      </header>

      <section className="mt-8">
        <h2 className="text-2xl font-bold">المواقف</h2>
        <div className="mt-3 space-y-3">
          {categories.map((c) => {
            const src = positionSources[id]?.[c.id];
            return (
              <div key={c.id} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                <h3 className="font-semibold text-sky-300">{ar.categories[c.id]}</h3>
                {t.topics[c.id] ? (
                  <p className="mt-1 text-slate-300">
                    {t.topics[c.id]} {src && <Src href={src.source} date={src.date} label={t.sourceLabels[c.id]} />}
                  </p>
                ) : (
                  <p className="mt-1 text-slate-500">لم نجد تطرّقًا من الحزب لهذه القضية.</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {lines && arLines && (lines.recommends || lines.wontSitWith.length > 0 || lines.conditions.length > 0) && (
        <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <h2 className="text-2xl font-bold">مع من سيجلس في الحكومة؟</h2>
          <dl className="mt-2 space-y-2 text-sm text-slate-300">
            {lines.recommends && arLines.recommends && (
              <div>
                <dt className="text-xs text-slate-500">يوصي بـ</dt>
                <dd>
                  {arLines.recommends} <Src href={lines.recommends.source} date={lines.recommends.date} />
                </dd>
              </div>
            )}
            {lines.wontSitWith.length > 0 && (
              <div>
                <dt className="text-xs text-rose-300">لن يجلس مع</dt>
                {lines.wontSitWith.map((w, i) => (
                  <dd key={i}>
                    <b>{ar.parties[w.party]?.name}</b>
                    {arLines.wontSitWithNotes[i] && <span className="text-slate-500"> ({arLines.wontSitWithNotes[i]})</span>}:{" "}
                    {arLines.wontSitWith[i]} <Src href={w.source} date={w.date} />
                  </dd>
                ))}
              </div>
            )}
            {lines.conditions.length > 0 && (
              <div>
                <dt className="text-xs text-amber-300">شروط</dt>
                {lines.conditions.map((c, i) => (
                  <dd key={i}>
                    {arLines.conditions[i]} <Src href={c.source} date={c.date} />
                  </dd>
                ))}
              </div>
            )}
          </dl>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-2xl font-bold">أول عشرة في القائمة</h2>
        <ol className="mt-3 grid gap-2 sm:grid-cols-2">
          {party.candidates.slice(0, 10).map((c) => {
            const a = t.candidates[String(c.pos)];
            return (
              <li key={c.pos} className="flex gap-3 rounded-lg border border-slate-800 bg-slate-900/40 p-3 text-sm">
                <span className="w-6 shrink-0 font-bold tabular-nums text-slate-500">{c.pos}</span>
                <div>
                  <div className="font-semibold">{a?.name ?? c.name}</div>
                  {a?.note && <div className="text-xs text-slate-400">{a.note}</div>}
                </div>
              </li>
            );
          })}
        </ol>
        <p className="mt-2 text-xs text-slate-500">
          القائمة كاملة كما قدّمتها للجنة الانتخابات المركزية،{" "}
          <a href={party.listSource} target="_blank" rel="noreferrer" className="underline">
            بالعبرية
          </a>
          .
        </p>
      </section>
    </main>
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
