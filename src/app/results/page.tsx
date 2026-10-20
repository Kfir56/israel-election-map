import Link from "next/link";
import CoalitionFinder from "@/components/CoalitionFinder";
import { MAJORITY, parties } from "@/data/parties";
import { averageSeats } from "@/data/polls";
import results from "@/data/results-2026.json";
import { colorOnDark } from "@/lib/party-color";
import { ogImage } from "@/lib/site";

export const metadata = {
  title: "תוצאות הבחירות · המפה הפוליטית 2026",
  description: "המדגמים ב־22:00 ותוצאות הספירה של הבחירות לכנסת ה־26, עם מחשבון קואליציות.",
  openGraph: { images: [ogImage("תוצאות הבחירות", "המדגמים והספירה, 27 באוקטובר")] },
};

// Filled in by hand on election night, from the TV exit polls and the
// Central Elections Committee count. `status` says which stage we're at.
type Seats = Record<string, number>;
type ExitPoll = { outlet: string; time: string; source: string; seats: Seats };
type Count = { percentCounted: number; time: string; source: string; seats: Seats; final?: boolean };
const data = results as { status: "before" | "exit" | "counting" | "final"; updated: string | null; exitPolls: ExitPoll[]; count: Count | null };

const name = (id: string) => parties.find((p) => p.id === id)?.name ?? id;

const timeline = [
  { when: "27.10, 07:00", what: "הקלפיות נפתחות." },
  { when: "27.10, 22:00", what: "הקלפיות נסגרות, וערוצי הטלוויזיה מפרסמים מדגמים: הערכה לפי ראיונות עם מצביעים ביציאה מהקלפי." },
  { when: "הלילה", what: "ועדת הבחירות מפרסמת את הספירה בהדרגה. התוצאות זזות לאורך הלילה, כי יישובים שונים נספרים בקצב שונה." },
  { when: "1–2 ימים אחרי", what: "נספרות המעטפות הכפולות (חיילים, אסירים, מאושפזים ועוד). הן יכולות להזיז מנדט או שניים." },
  { when: "4.11", what: "התוצאות הרשמיות הסופיות מתפרסמות ברשומות." },
  { when: "אחר כך", what: "הנשיא מתייעץ עם הסיעות ומטיל על אחד מחברי הכנסת להרכיב ממשלה, עם 28 ימים ואפשרות להארכה של 14." },
];

function SeatBars({ seats }: { seats: Seats }) {
  const rows = Object.entries(seats)
    .filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1]);
  const max = Math.max(...rows.map(([, s]) => s));
  return (
    <ul className="space-y-1.5">
      {rows.map(([id, s]) => (
        <li key={id} className="flex items-center gap-3">
          <Link href={`/party/${id}`} className="w-36 shrink-0 truncate text-sm hover:text-sky-300">
            {name(id)}
          </Link>
          <span className="h-4 flex-1">
            <span className="block h-full rounded-e" style={{ width: `${(s / max) * 100}%`, background: colorOnDark(id) }} />
          </span>
          <span className="w-8 text-sm font-bold tabular-nums">{s}</span>
          <span className="w-10 text-xs tabular-nums text-slate-500" title="ממוצע הסקרים לפני הבחירות">
            {averageSeats[id] !== undefined ? `(${averageSeats[id]})` : "(0)"}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function ResultsPage() {
  const main = data.count?.seats ?? data.exitPolls[0]?.seats ?? null;
  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <h1 className="text-3xl font-extrabold sm:text-4xl">תוצאות הבחירות</h1>
      {data.status === "before" ? (
        <p className="mt-2 text-lg text-slate-300">
          כאן יופיעו המדגמים ב־27 באוקטובר בשעה 22:00, ואחריהם תוצאות הספירה. עד אז, ככה זה יעבוד:
        </p>
      ) : (
        <p className="mt-2 text-lg text-slate-300">
          {data.status === "exit" && "אלה מדגמים, לא תוצאות. הם הערכה, ובעבר טעו במנדט או שניים לכל מפלגה."}
          {data.status === "counting" && `ספירה חלקית: נספרו ${data.count?.percentCounted}% מהקולות. התוצאות עוד ישתנו.`}
          {data.status === "final" && "התוצאות הסופיות של ועדת הבחירות המרכזית."}
          {data.updated && <span className="text-sm text-slate-500"> עודכן: {data.updated}</span>}
        </p>
      )}

      {data.count && (
        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
          <h2 className="text-xl font-bold">
            {data.count.final ? "התוצאות הסופיות" : `הספירה (${data.count.percentCounted}% מהקולות)`}
          </h2>
          <p className="mb-3 text-sm text-slate-400">
            בסוגריים: ממוצע הסקרים לפני הבחירות.{" "}
            <a href={data.count.source} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">
              המקור, {data.count.time}
            </a>
          </p>
          <SeatBars seats={data.count.seats} />
        </section>
      )}

      {data.exitPolls.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xl font-bold">המדגמים של 22:00</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {data.exitPolls.map((e) => (
              <div key={e.outlet} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
                <div className="mb-2 flex items-baseline justify-between">
                  <b>{e.outlet}</b>
                  <a href={e.source} target="_blank" rel="noreferrer" className="text-xs text-sky-400 hover:underline">
                    מקור, {e.time}
                  </a>
                </div>
                <SeatBars seats={e.seats} />
              </div>
            ))}
          </div>
        </section>
      )}

      {main && (
        <section className="mt-8">
          <h2 className="text-2xl font-bold">מי יכול להקים ממשלה עם התוצאות האלה?</h2>
          <p className="mt-1 text-sm text-slate-400">
            לפי {data.count ? "הספירה" : `המדגם של ${data.exitPolls[0].outlet}`}. צריך {MAJORITY} מנדטים.
          </p>
          <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/30 p-4 sm:p-5">
            <CoalitionFinder fixedSeats={main} />
          </div>
        </section>
      )}

      <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
        <h2 className="text-xl font-bold">מה קורה מהרגע שהקלפיות נסגרות</h2>
        <ol className="mt-3 space-y-3">
          {timeline.map((t) => (
            <li key={t.when} className="flex gap-4">
              <span className="w-28 shrink-0 text-sm font-semibold text-sky-300">{t.when}</span>
              <span className="text-slate-300">{t.what}</span>
            </li>
          ))}
        </ol>
      </section>

      {data.status === "before" && (
        <p className="mt-6 text-sm text-slate-400">
          בינתיים אפשר{" "}
          <Link href="/predict" className="text-sky-400 hover:underline">
            לחזות את התוצאות
          </Link>{" "}
          ולהשוות מול החברים, או לראות{" "}
          <Link href="/coalitions" className="text-sky-400 hover:underline">
            אילו קואליציות אפשריות לפי הסקרים
          </Link>
          .
        </p>
      )}
    </main>
  );
}
