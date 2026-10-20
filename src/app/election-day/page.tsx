import Link from "next/link";
import CalendarButtons from "@/components/CalendarButtons";
import Term from "@/components/Term";
import facts from "@/data/election-day.json";
import { formatDate } from "@/data/polls";
import { ogImage } from "@/lib/site";

export const metadata = {
  title: "מדריך ליום הבחירות · המפה הפוליטית 2026",
  description: "שעות הקלפיות, איזו תעודה להביא, איך מצביעים, איך מוצאים את הקלפי, תחבורה חינם ומתי יוצאות התוצאות.",
  openGraph: { images: [ogImage("מדריך ליום הבחירות", "27 באוקטובר: כל מה שצריך לדעת לפני שהולכים לקלפי")] },
};

type Fact = { section: string; text: string; source: string; sourceLabel: string; date: string };

const sections: { id: string; icon: string; title: string }[] = [
  { id: "hours", icon: "🕖", title: "מתי הקלפיות פתוחות" },
  { id: "id", icon: "🪪", title: "מה להביא" },
  { id: "where", icon: "📍", title: "איפה מצביעים" },
  { id: "steps", icon: "🗳️", title: "איך מצביעים, ומה פוסל את הקול" },
  { id: "dayoff", icon: "🚆", title: "יום חופש ותחבורה חינם" },
  { id: "special", icon: "🏥", title: "חיילים, מאושפזים, נגישות ומלווים" },
  { id: "results", icon: "📊", title: "מתי יודעים מה התוצאות" },
  { id: "myths", icon: "❗", title: "כדאי לדעת" },
];

export default function ElectionDayPage() {
  const list = facts as Fact[];
  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <h1 className="text-3xl font-extrabold sm:text-4xl">מדריך ליום הבחירות</h1>
      <p className="mt-2 text-lg text-slate-300">
        יום שלישי, 27 באוקטובר 2026. כל מה שצריך לדעת לפני שהולכים לקלפי, ולכל פרט יש מקור.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Box value="07:00–22:00" label="שעות ההצבעה ברוב הקלפיות" />
        <Box value="תעודה מזהה" label="ת״ז, דרכון או רישיון נהיגה" />
        <Box value="חינם" label="רכבת ואוטובוסים בין־עירוניים" />
        <Box value="22:00" label="המדגמים בטלוויזיה" />
      </div>

      <nav className="mt-6 flex flex-wrap gap-2 text-sm">
        {sections.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="rounded-full border border-slate-700 px-3 py-1 hover:border-sky-500/60">
            {s.icon} {s.title}
          </a>
        ))}
      </nav>

      {sections.map((s) => (
        <section key={s.id} id={s.id} className="mt-8 scroll-mt-20">
          <h2 className="text-2xl font-bold">
            {s.icon} {s.title}
          </h2>
          <ul className="mt-3 space-y-2">
            {list
              .filter((f) => f.section === s.id)
              .map((f) => (
                <li key={f.text} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                  <p className="text-slate-200">{f.text}</p>
                  <a
                    href={f.source}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1.5 inline-block text-xs text-slate-500 hover:text-sky-300"
                  >
                    {f.sourceLabel} · {formatDate(f.date)}
                  </a>
                </li>
              ))}
          </ul>
          {s.id === "steps" && (
            <p className="mt-2 text-sm text-slate-400">
              ומה עם <Term id="blankVote">פתק לבן</Term>? פירטנו בעמוד{" "}
              <Link href="/why-vote" className="text-sky-400 underline">
                למה להצביע
              </Link>
              .
            </p>
          )}
          {s.id === "results" && (
            <p className="mt-2 text-sm text-slate-400">
              בליל הבחירות נעדכן את{" "}
              <Link href="/results" className="text-sky-400 underline">
                עמוד התוצאות
              </Link>{" "}
              עם <Term id="exitPoll">המדגמים</Term> והספירה.
            </p>
          )}
        </section>
      ))}

      <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
        <h2 className="text-xl font-bold">להוסיף תזכורת ליומן</h2>
        <CalendarButtons />
      </section>

      <p className="mt-8 text-xs leading-relaxed text-slate-500">
        את הפרטים אספנו ממדריכי ״כל זכות״, ערוץ הכנסת ואתרי חדשות שפרסמו את הנחיות ועדת הבחירות המרכזית לבחירות 2026. אם
        משהו לא ברור, המקור המחייב הוא{" "}
        <a href="https://www.bechirot.gov.il/" target="_blank" rel="noreferrer" className="underline">
          אתר ועדת הבחירות המרכזית
        </a>
        .
      </p>
    </main>
  );
}

function Box({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-3 text-center">
      <div className="text-xl font-extrabold text-sky-300">
        <bdi>{value}</bdi>
      </div>
      <div className="mt-1 text-xs text-slate-400">{label}</div>
    </div>
  );
}
