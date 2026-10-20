import Link from "next/link";
import CoalitionFinder from "@/components/CoalitionFinder";
import SurplusAgreements from "@/components/SurplusAgreements";
import { coalitionLines, type Sourced } from "@/data/coalitions";
import { parties } from "@/data/parties";
import { averageSeats, formatDate } from "@/data/polls";
import { colorOnDark } from "@/lib/party-color";
import { ogImage } from "@/lib/site";

export const metadata = {
  openGraph: { images: [ogImage("מי יכול להקים ממשלה?", "הצירופים שמגיעים ל־61, והקווים האדומים")] },
  title: "קואליציות אפשריות · המפה הפוליטית 2026",
  description: "אילו צירופי מפלגות מגיעים ל־61 לפי הסקרים, ועם מי כל מפלגה אמרה שלא תשב.",
};

const name = (id: string) => parties.find((p) => p.id === id)?.name ?? id;

function Src({ s }: { s: Sourced }) {
  return (
    <a href={s.source} target="_blank" rel="noreferrer" className="whitespace-nowrap text-xs text-sky-400 hover:underline">
      מקור, {formatDate(s.date)}
    </a>
  );
}

export default function CoalitionsPage() {
  const ordered = parties
    .filter((p) => coalitionLines[p.id])
    .sort((a, b) => (averageSeats[b.id] ?? 0) - (averageSeats[a.id] ?? 0));

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <h1 className="text-3xl font-extrabold sm:text-4xl">מי יכול להקים ממשלה?</h1>
      <p className="mt-2 text-lg text-slate-300">
        כדי להקים ממשלה צריך 61 חברי כנסת. כאן רואים אילו צירופים של מפלגות מגיעים לזה לפי הסקרים, ואיזה מהם שובר
        &quot;קו אדום&quot; שמפלגה הצהירה עליו.
      </p>

      <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/30 p-4 sm:p-5">
        <CoalitionFinder />
        <p className="mt-4 text-xs leading-relaxed text-slate-500">
          מוצגים רק צירופים שכל מפלגה בהם נחוצה: אם מוציאים אחת, יורדים מתחת ל־61. צירוף גדול יותר הוא אחד מאלה ועוד
          מפלגות. מכיוון שכל מפלגה בצירוף נחוצה, גם הצהרה כמו &quot;לא נסתמך על&quot; נחשבת כאן קו אדום. מפלגות משנות
          עמדות אחרי הבחירות, אז זו תמונה של מה שנאמר עד היום ולא תחזית.
        </p>
      </section>

      <SurplusAgreements />

      <h2 className="mt-10 text-2xl font-bold">מה כל מפלגה אמרה</h2>
      <p className="mt-1 text-sm text-slate-400">את מי היא ממליצה להרכיב ממשלה, עם מי לא תשב, ומה התנאים שלה.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {ordered.map((p) => {
          const l = coalitionLines[p.id];
          // Several refusals often share one quote; show it once.
          const groups = new Map<string, { ids: string[]; s: Sourced; note?: string }>();
          for (const w of l.wontSitWith) {
            const g = groups.get(w.text) ?? { ids: [], s: w, note: w.note };
            g.ids.push(w.party);
            groups.set(w.text, g);
          }
          const empty = !l.recommends && !groups.size && !l.conditions.length;
          return (
            <div key={p.id} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <Link href={`/party/${p.id}`} className="flex items-center gap-2 font-bold hover:text-sky-300">
                <span className="h-3 w-3 rounded-full" style={{ background: colorOnDark(p.id) }} />
                {p.name}
                <span className="text-sm font-normal text-slate-500">{averageSeats[p.id] ?? 0} מנדטים בממוצע</span>
              </Link>
              <dl className="mt-2 space-y-2 text-sm text-slate-300">
                {l.recommends && (
                  <div>
                    <dt className="text-xs text-slate-500">ממליצה על</dt>
                    <dd>
                      {l.recommends.text} <Src s={l.recommends} />
                    </dd>
                  </div>
                )}
                {groups.size > 0 && (
                  <div>
                    <dt className="text-xs text-rose-300">לא תשב עם</dt>
                    {[...groups.values()].map((g) => (
                      <dd key={g.s.text}>
                        <b>{g.ids.map(name).join(", ")}</b>
                        {g.note && <span className="text-slate-500"> ({g.note})</span>}: {g.s.text} <Src s={g.s} />
                      </dd>
                    ))}
                  </div>
                )}
                {l.conditions.length > 0 && (
                  <div>
                    <dt className="text-xs text-amber-300">תנאים</dt>
                    {l.conditions.map((c) => (
                      <dd key={c.text}>
                        {c.text} <Src s={c} />
                      </dd>
                    ))}
                  </div>
                )}
                {empty && <p className="text-slate-500">לא מצאנו הצהרה של המפלגה על שותפות או קווים אדומים.</p>}
              </dl>
            </div>
          );
        })}
      </div>
      <p className="mt-6 text-xs text-slate-500">
        ההצהרות נאספו מכתבות בעיתונות ב־19–20 באוקטובר 2026, כל אחת עם קישור למקור ותאריך. כחול לבן לא מופיעה כי פרשה
        מהמרוץ. האתר לא ממליץ על אף מפלגה או קואליציה.
      </p>
    </main>
  );
}
