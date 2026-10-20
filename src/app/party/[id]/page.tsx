import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BallotLetter from "@/components/BallotLetter";
import CutoffLine from "@/components/CutoffLine";
import { blocLabels, categories, formatSourceDate, parties, positionSources, sourceTypeLabels } from "@/data/parties";
import { partyHistory } from "@/data/party-history";
import { bioFor, personHref, partyHref } from "@/data/people";
import { averageSeats, formatDate, partyRange, polls } from "@/data/polls";
import { topicHref } from "@/data/topics";
import { ogImage } from "@/lib/site";
import Term from "@/components/Term";

const link = "text-sky-400 underline";
const INCUMBENT = /כנסת ה־25|ממשלה ה־37/;

export function generateStaticParams() {
  return parties.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const party = parties.find((p) => p.id === id);
  if (!party) return { title: "המפה הפוליטית 2026" };
  const sub = `בראשות ${party.leader} · ${averageSeats[party.id] ? `${averageSeats[party.id]} מנדטים בסקרים` : "מתחת לחסימה בסקרים"}`;
  return {
    title: `${party.name} · המפה הפוליטית 2026`,
    description: `העמדות, המועמדים והסקרים של ${party.name}.`,
    openGraph: { images: [ogImage(party.name, sub)] },
  };
}

export default async function PartyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const party = parties.find((p) => p.id === id);
  if (!party) notFound();

  const range = partyRange(party.id);
  const history = partyHistory[party.id] ?? [];
  const incumbents = party.candidates.filter((c) => c.note && INCUMBENT.test(c.note)).length;
  // Only a real joint list has a faction on every candidate.
  const factions = party.candidates.every((c) => c.faction)
    ? [...new Set(party.candidates.map((c) => c.faction!))]
    : [];
  const maxSeats = Math.max(...range.values, 1);

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <Link href="/" className="text-sm text-slate-400 hover:text-sky-300">
        → חזרה למפה
      </Link>

      <header className="mt-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
        <div className="h-2" style={{ background: party.color }} />
        <div className="p-5 sm:p-7">
          <div className="text-xs text-slate-400">{blocLabels[party.bloc]}</div>
          <div className="mt-1 flex items-center gap-4">
            <h1 className="text-4xl font-extrabold sm:text-5xl">{party.name}</h1>
            <div className="flex flex-col items-center gap-0.5">
              <BallotLetter letter={party.letter} />
              <span className="text-[10px] text-slate-500">הפתק בקלפי</span>
            </div>
          </div>
          <p className="mt-2 text-slate-300">
            בראשות{" "}
            <Link href={personHref(party.id, 1)} className="font-semibold hover:text-sky-300">
              {party.leader}
            </Link>
            {factions.length > 0 && <> · רשימה משותפת של {factions.join(", ")}</>}
          </p>
          <Link
            href={`/compare?a=${party.id}&b=${parties.find((p) => p.id !== party.id)!.id}`}
            className="mt-3 inline-block text-sm text-sky-400 hover:underline"
          >
            להשוות את {party.name} למפלגה אחרת ←
          </Link>
          {party.withdrawn && (
            <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-100">
              <b>המפלגה פרשה מהמרוץ.</b> {party.withdrawn.text}{" "}
              <a href={party.withdrawn.source} target="_blank" rel="noreferrer" className="underline">
                מקור, {formatSourceDate(party.withdrawn.date)}
              </a>
            </div>
          )}
          <p className="mt-4 max-w-3xl text-slate-300">{party.summary}</p>

          <div className="mt-6 grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
            <Stat
              label={`ממוצע ${polls.length} הסקרים`}
              value={averageSeats[party.id] ? `${averageSeats[party.id]}` : "מתחת לחסימה"}
            />
            <Stat label="טווח בסקרים" value={range.min === range.max ? `${range.max}` : `${range.min}–${range.max}`} />
            <Stat label="בכנסת היוצאת" value={party.seats25 !== undefined ? `${party.seats25}` : "מפלגה חדשה"} />
            <Stat label="ח״כים ושרים מכהנים ברשימה" value={`${incumbents}`} />
          </div>
        </div>
      </header>

      <Section title="מה המפלגה אומרת">
        {Object.keys(party.positions).length === 0 && (
          <p className="mb-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
            המכון הישראלי לדמוקרטיה עוד לא פרסם סיכום עמדות לרשימה הזו, ולכן לא כתבנו עמדות משלנו.
          </p>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          {categories.map((c) => {
            const others = parties.filter((p) => p.id !== party.id && p.positions[c.id]);
            const src = positionSources[party.id]?.[c.id];
            return (
              <div key={c.id} className="rounded-xl border border-slate-800 p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="text-sm font-semibold text-sky-400">{c.label}</div>
                  <Link href={topicHref(c.id)} className="text-xs text-slate-500 hover:text-sky-300">
                    על הנושא ←
                  </Link>
                </div>
                <p className="mt-1.5">
                  {party.positions[c.id] ?? <span className="text-slate-500">לא מצאנו התייחסות של המפלגה לנושא</span>}
                </p>
                {src && (
                  <a
                    href={src.source}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1.5 inline-flex flex-wrap items-center gap-1.5 text-xs text-slate-500 hover:text-sky-300"
                  >
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">
                      {sourceTypeLabels[src.sourceType]}
                    </span>
                    {src.sourceLabel} · {src.sourceType === "idi" ? "נבדק ב־" : ""}
                    {formatSourceDate(src.date)}
                  </a>
                )}
                {others.length > 0 && (
                  <details className="mt-3 text-sm">
                    <summary className="cursor-pointer text-slate-400 hover:text-sky-300">
                      ומה אומרות {others.length} המפלגות האחרות?
                    </summary>
                    <ul className="mt-2 space-y-2">
                      {others.map((o) => (
                        <li key={o.id} className="border-r-2 pr-2" style={{ borderColor: o.color }}>
                          <Link href={partyHref(o.id)} className="font-semibold hover:text-sky-300">
                            {o.name}
                          </Link>
                          <span className="text-slate-300">: {o.positions[c.id]}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          לכל נושא מופיע המקור והתאריך שלו: מצע המפלגה, האתר שלה או הצהרה מתועדת מ־2026. איפה שלא מצאנו מקור חדש יותר,
          השארנו את הסיכום של{" "}
          <a href={party.idiPage} target="_blank" rel="noreferrer" className={link}>
            המכון הישראלי לדמוקרטיה
          </a>
          . הניסוח בתמצות שלנו.
          {party.platform && (
            <>
              {" "}
              <a href={party.platform} target="_blank" rel="noreferrer" className={link}>
                המצע המלא
              </a>
            </>
          )}
          {party.website && (
            <>
              {" "}
              <a href={party.website} target="_blank" rel="noreferrer" className={link}>
                אתר המפלגה
              </a>
            </>
          )}
        </p>
      </Section>

      <Section title={`הרשימה (${party.candidates.length} המקומות הראשונים)`}>
        <ol className="grid gap-2 sm:grid-cols-2">
          {party.candidates.map((c) => {
            const bio = bioFor(party.id, c.pos);
            const seats = averageSeats[party.id] ?? 0;
            return [
              <li key={c.pos} className={seats && c.pos > seats ? "opacity-60" : undefined}>
                <Link
                  href={personHref(party.id, c.pos)}
                  className="group flex h-full items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-3 transition hover:border-sky-500/60 hover:bg-slate-800/60"
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold text-slate-950"
                    style={{ background: party.color }}
                  >
                    {c.pos}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold group-hover:text-sky-300">{c.name}</div>
                    <div className="text-xs text-slate-400">
                      {bio?.summary ?? [c.note, c.faction && `מטעם ${c.faction}`].filter(Boolean).join(" · ")}
                    </div>
                  </div>
                  {bio && (
                    <span className="shrink-0 rounded-full bg-sky-500/15 px-2 py-0.5 text-[11px] text-sky-300">
                      ביוגרפיה
                    </span>
                  )}
                </Link>
              </li>,
              seats > 0 && c.pos === seats && c.pos < party.candidates.length && (
                <CutoffLine key="cutoff" label={`קו הכניסה לפי ממוצע הסקרים: ${seats} מנדטים`} />
              ),
            ];
          })}
        </ol>
        {(averageSeats[party.id] ?? 0) > 0 && (
          <p className="mt-3 text-xs text-slate-400">
            מי שמעל הקו נכנס לכנסת אם המפלגה תקבל את ממוצע הסקרים. הטווח בסקרים:{" "}
            {range.min === range.max ? range.max : `${range.min}–${range.max}`} מנדטים. שרים שיתפטרו לפי{" "}
            <Term id="norwegian">החוק הנורבגי</Term> יכולים להכניס עוד כמה מועמדים מתחת לקו.
          </p>
        )}
        <p className="mt-3 text-xs text-slate-500">
          הסדר והשמות לפי{" "}
          <a href={party.listSource} target="_blank" rel="noreferrer" className={link}>
            רשימת המועמדים שהוגשה לוועדת הבחירות
          </a>{" "}
          (דרך המכון הישראלי לדמוקרטיה). הרקע והביוגרפיות נכתבו על ידינו מוויקיפדיה ואינם חלק מהרשימה.
        </p>
      </Section>

      {history.length > 0 && (
        <Section title="ציוני דרך">
          <ol className="relative border-r border-slate-700 pr-5">
            {history.map((m, i) => (
              <li key={i} className="relative mb-4">
                <span
                  className="absolute -right-[25px] top-1.5 h-2.5 w-2.5 rounded-full"
                  style={{ background: party.color }}
                />
                <div dir="ltr" className="text-right font-mono text-sm text-slate-400">
                  {m.year}
                </div>
                <div>{m.text}</div>
              </li>
            ))}
          </ol>
          <p className="text-xs text-slate-500">רקע שכתבנו על סמך ויקיפדיה, ולא מקור רשמי.</p>
        </Section>
      )}

      <Section title="בסקרים">
        <ul className="space-y-1.5">
          {polls.map((p, i) => {
            const v = range.values[i];
            return (
              <li key={p.id} className="flex items-center gap-3 text-sm">
                <a
                  href={p.source}
                  target="_blank"
                  rel="noreferrer"
                  className="w-36 shrink-0 truncate hover:text-sky-300"
                >
                  {p.outlet} <span className="text-xs text-slate-500">{formatDate(p.date)}</span>
                </a>
                <div className="h-3 flex-1 rounded-full bg-slate-800">
                  <div
                    className="h-3 rounded-full"
                    style={{ width: `${(v / maxSeats) * 100}%`, background: party.color }}
                  />
                </div>
                <span className="w-6 text-left font-mono">{v || "—"}</span>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-xs text-slate-500">
          כל שורה מקשרת לסקר עצמו בארכיון skarim.org. ״—״ פירושו מתחת לאחוז החסימה.
        </p>
      </Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="mb-4 text-2xl font-bold">{title}</h2>
      {children}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-800/60 p-3">
      <div className="text-xs text-slate-400">{label}</div>
      <div dir="ltr" className="mt-0.5 text-xl font-bold">
        {value}
      </div>
    </div>
  );
}
