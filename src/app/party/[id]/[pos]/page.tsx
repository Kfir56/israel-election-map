import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { parties } from "@/data/parties";
import { bioFor, findCandidate, partyHref, personHref, recordFor, wikiUrl, type RecordItem } from "@/data/people";

const link = "text-sky-400 underline";

type Params = Promise<{ id: string; pos: string }>;

export function generateStaticParams() {
  return parties.flatMap((p) => p.candidates.map((c) => ({ id: p.id, pos: String(c.pos) })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id, pos } = await params;
  const found = findCandidate(id, Number(pos));
  return { title: found ? `${found.candidate.name} · ${found.party.name}` : "המפה הפוליטית 2026" };
}

export default async function PersonPage({ params }: { params: Params }) {
  const { id, pos } = await params;
  const found = findCandidate(id, Number(pos));
  if (!found) notFound();
  const { party, candidate } = found;
  const bio = bioFor(party.id, candidate.pos);
  const record = recordFor(party.id, candidate.pos);
  const idx = party.candidates.indexOf(candidate);
  const prev = party.candidates[idx - 1];
  const next = party.candidates[idx + 1];

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <nav className="text-sm text-slate-400">
        <Link href="/" className="hover:text-sky-300">
          המפה
        </Link>
        {" / "}
        <Link href={partyHref(party.id)} className="hover:text-sky-300">
          {party.name}
        </Link>
      </nav>

      <header className="mt-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
        <div className="h-2" style={{ background: party.color }} />
        <div className="flex items-start gap-4 p-5 sm:p-7">
          <span
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full font-mono text-2xl font-bold text-slate-950"
            style={{ background: party.color }}
          >
            {candidate.pos}
          </span>
          <div>
            <h1 className="text-3xl font-extrabold sm:text-4xl">{candidate.name}</h1>
            <p className="mt-1 text-slate-300">
              מקום {candidate.pos} ברשימת{" "}
              <Link href={partyHref(party.id)} className="font-semibold hover:text-sky-300">
                {party.name}
              </Link>
              {candidate.faction && <> · מטעם {candidate.faction}</>}
            </p>
            {(bio?.summary ?? candidate.note) && <p className="mt-3 text-lg">{bio?.summary ?? candidate.note}</p>}
          </div>
        </div>
      </header>

      {bio ? (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {bio.born && <Fact label="נולד/ה">{bio.born}</Fact>}
            {bio.parties && <Fact label="מפלגות">{bio.parties}</Fact>}
            {bio.education.length > 0 && (
              <Fact label="השכלה">
                <ul className="list-disc space-y-0.5 pr-4">
                  {bio.education.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </Fact>
            )}
            {bio.military && <Fact label="שירות צבאי וביטחוני">{bio.military}</Fact>}
          </div>

          {bio.roles.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-4 text-2xl font-bold">תפקידים קודמים</h2>
              <ol className="relative border-r border-slate-700 pr-5">
                {bio.roles.map((r, i) => (
                  <li key={i} className="relative mb-4">
                    <span className="absolute -right-[25px] top-1.5 h-2.5 w-2.5 rounded-full" style={{ background: party.color }} />
                    {r.years && (
                      <div dir="ltr" className="text-right text-sm tabular-nums text-slate-400">
                        {r.years.replace(/–(?=,|$)/g, "–היום")}
                      </div>
                    )}
                    <div>{r.title}</div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {record && (
            <section className="mt-8">
              <h2 className="mb-1 text-2xl font-bold">בתפקידים בממשלה</h2>
              <p className="mb-4 text-sm text-slate-400">
                צעדים בולטים והביקורת עליהם, כפי שהם מתוארים ב
                <a href={wikiUrl(record.wiki, "he")} target="_blank" rel="noreferrer" className={link}>
                  ערך בוויקיפדיה העברית
                </a>
                , בתמצות שלנו.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {record.plus.length > 0 && <RecordList title="צעדים בולטים" items={record.plus} tone="text-emerald-400" />}
                {record.minus.length > 0 && <RecordList title="ביקורת ומחלוקות" items={record.minus} tone="text-rose-400" />}
              </div>
            </section>
          )}

          <p className="mt-6 text-xs text-slate-500">
            {bio.wiki ? (
              <>
                מקור: הערך על {candidate.name} ב
                <a href={wikiUrl(bio.wiki, bio.lang)} target="_blank" rel="noreferrer" className={link}>
                  {bio.lang === "he" ? "ויקיפדיה העברית" : "ויקיפדיה האנגלית"}
                </a>
                , {bio.lang === "he" ? "בתמצות שלנו" : "בתרגום ובתמצות שלנו"} (נאסף ב־19 באוקטובר 2026).
              </>
            ) : (
              <>
                אין ערך בוויקיפדיה על {candidate.name}. מקורות:{" "}
                {bio.sources?.map((s, i) => (
                  <span key={s.url}>
                    {i > 0 && ", "}
                    <a href={s.url} target="_blank" rel="noreferrer" className={link}>
                      {s.label}
                    </a>
                  </span>
                ))}
                , בתמצות שלנו (נאסף ב־19 באוקטובר 2026).
              </>
            )}
          </p>
        </>
      ) : (
        <p className="mt-6 rounded-xl border border-slate-800 p-4 text-slate-300">
          עוד לא כתבנו ביוגרפיה מפורטת על {candidate.name}. המקום ברשימה לקוח מ
          <a href={party.listSource} target="_blank" rel="noreferrer" className={link}>
            הרשימה שהוגשה לוועדת הבחירות
          </a>
          .
        </p>
      )}

      <nav className="mt-10 flex justify-between gap-3 border-t border-slate-800 pt-4 text-sm">
        {prev ? (
          <Link href={personHref(party.id, prev.pos)} className="hover:text-sky-300">
            → {prev.pos}. {prev.name}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={personHref(party.id, next.pos)} className="hover:text-sky-300">
            {next.pos}. {next.name} ←
          </Link>
        )}
      </nav>
    </main>
  );
}

function RecordList({ title, items, tone }: { title: string; items: RecordItem[]; tone: string }) {
  return (
    <div className="rounded-xl border border-slate-800 p-4">
      <h3 className={`mb-2 font-semibold ${tone}`}>{title}</h3>
      <ul className="space-y-2">
        {items.map((r, i) => (
          <li key={i}>
            {r.years && (
              <span dir="ltr" className="ml-2 text-sm tabular-nums text-slate-400">
                {r.years.replace(/–$/, "–היום")}
              </span>
            )}
            {r.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-800 p-4">
      <div className="text-xs font-semibold text-sky-400">{label}</div>
      <div className="mt-1">{children}</div>
    </div>
  );
}
