import Link from "next/link";
import CalendarButtons from "@/components/CalendarButtons";
import Explorer from "@/components/Explorer";
import { MAJORITY, parties } from "@/data/parties";
import { averageSeats, polls } from "@/data/polls";

const faq: { q: string; a: string }[] = [
  {
    q: "מה קורה לפתק לבן?",
    a: "פתק לבן נחשב קול פסול. הוא לא נספר בחלוקת המנדטים ולא נרשם כמחאה, כך שמבחינת התוצאה הוא שווה להישאר בבית. בעמוד ״למה להצביע״ יש את כל המספרים.",
  },
  {
    q: "מה זה מנדט?",
    a: "בכנסת יש 120 מושבים, וכל מושב נקרא מנדט. המנדטים מתחלקים בין הרשימות שעברו את אחוז החסימה, לפי אחוז הקולות שכל אחת קיבלה.",
  },
  {
    q: "מה זה אחוז החסימה?",
    a: "רשימה צריכה לפחות 3.25% מהקולות הכשרים כדי להיכנס לכנסת. רשימה שלא עוברת מקבלת אפס מנדטים, ורשימה שעוברת מקבלת לפחות 4. בסקרים, ״—״ מסמן רשימה מתחת לחסימה.",
  },
  {
    q: "למה צריך 61?",
    a: "61 הם רוב של 120 חברי הכנסת. כדי שממשלה תקום ותשרוד בהצבעות, ראש הממשלה צריך קואליציה של מפלגות שיחד יש להן לפחות 61 מנדטים. (טכנית מספיק שיותר חברי כנסת יתמכו מאשר יתנגדו, אבל ממשלת מיעוט כזו כמעט לא מחזיקה.)",
  },
  {
    q: "מה הם הגושים במפה?",
    a: "״מפלגות הקואליציה היוצאת״ הן המפלגות שהקימו את הממשלה ה־37: הליכוד, ש״ס, יהדות התורה, עוצמה יהודית והציונות הדתית (יהדות התורה פרשה מהקואליציה ביולי 2025 בגלל חוק הגיוס). ״המפלגות הערביות״ הן הרשימה המשותפת ורע״מ, וכל השאר באופוזיציה. זו חלוקה לפי העבר, ולא הבטחה למי ישב עם מי אחרי הבחירות.",
  },
  {
    q: "למה הסקרים כל כך שונים?",
    a: "כל מכון סוקר מדגם אחר של כמה מאות אנשים, בשיטה אחרת. בכל סקר יש טעות של כמה מנדטים לכל מפלגה, ולכן אנחנו מציגים את כל הסקרים עם קישור למקור, את הממוצע שלהם ואת הטווח בין הנמוך לגבוה.",
  },
  {
    q: "המשחק של החיזויים הוא על כסף?",
    a: "לא. הימורים על כסף אסורים בישראל, והמשחק כאן הוא בנקודות בלבד: חוזים כמה מנדטים כל רשימה תקבל ומשווים עם החברים.",
  },
];

export default function Home() {
  const ordered = [...parties].sort((a, b) => (averageSeats[b.id] ?? 0) - (averageSeats[a.id] ?? 0));
  const leader = ordered[0];
  const coalition = parties.filter((p) => p.bloc === "coalition").reduce((s, p) => s + (averageSeats[p.id] ?? 0), 0);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">מי נגד מי בבחירות 2026?</h1>
        <p className="mt-2 max-w-3xl text-slate-300">
          הבחירות לכנסת ה־26 ב־27 באוקטובר. כאן אפשר לראות את כל המפלגות על מפה אחת, להבין מה כל אחת חושבת ומי ברשימה
          שלה, להשוות בין הסקרים ולחזות את התוצאות עם החברים.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <Stat>
            הגדולה בממוצע הסקרים: <b style={{ color: leader.color }}>{leader.name}</b> ({averageSeats[leader.id]})
          </Stat>
          <Stat>
            הקואליציה היוצאת:{" "}
            <b className={coalition >= MAJORITY ? "text-emerald-300" : "text-rose-300"}>{coalition}</b> מתוך {MAJORITY}{" "}
            הדרושים
          </Stat>
          <Stat>ממוצע של {polls.length} סקרים אחרונים</Stat>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/predict"
            className="rounded-xl bg-sky-500 px-5 py-2.5 font-semibold text-slate-950 hover:bg-sky-400"
          >
            לחזות את התוצאות
          </Link>
          <Link
            href="/parties"
            className="rounded-xl border border-slate-700 px-5 py-2.5 font-semibold hover:bg-slate-800"
          >
            כל המפלגות והמועמדים
          </Link>
          <Link
            href="/quiz"
            className="rounded-xl border border-slate-700 px-5 py-2.5 font-semibold hover:bg-slate-800"
          >
            איזו מפלגה קרובה אליי?
          </Link>
          <Link
            href="/compare"
            className="rounded-xl border border-slate-700 px-5 py-2.5 font-semibold hover:bg-slate-800"
          >
            להשוות שתי מפלגות
          </Link>
        </div>
        <div className="mt-4 max-w-3xl rounded-xl border border-amber-400/30 bg-amber-400/5 p-3 text-sm text-slate-300">
          <b className="text-amber-200">יום הבחירות: שלישי, 27 באוקטובר.</b> הקלפיות פתוחות 07:00–22:00, וזה יום שבתון.
          מביאים תעודה מזהה עם תמונה ומצביעים רק בקלפי שלכם (בודקים אותה ב
          <a href="https://www.bechirot.gov.il/" target="_blank" rel="noreferrer" className="text-sky-400 underline">
            אתר ועדת הבחירות
          </a>
          ).{" "}
          <Link href="/election-day" className="text-sky-400 underline">
            המדריך המלא ליום הבחירות
          </Link>
          <CalendarButtons />
        </div>
      </header>

      <Explorer />

      <section id="faq" className="mt-12 scroll-mt-20">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-2xl font-bold">מושגים בקצרה</h2>
          <Link href="/guide" className="text-sm text-sky-400 hover:underline">
            להסבר המלא: איך עובדות הבחירות, עם מחשבון מנדטים ←
          </Link>
        </div>
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          {faq.map((f) => (
            <details
              key={f.q}
              className="group rounded-xl border border-slate-800 bg-slate-900/40 p-4 open:bg-slate-900/70"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                {f.q}
                <span className="text-slate-500 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 text-sm text-slate-300">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}

function Stat({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-slate-300">{children}</span>
  );
}
