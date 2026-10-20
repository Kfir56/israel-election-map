import Link from "next/link";

export const metadata = {
  title: "למה להצביע · המפה הפוליטית 2026",
  description: "מה קורה לקול שלך, מה קורה לפתק לבן, וכמה קולות הכריעו בפעם הקודמת.",
};

// All 2022 numbers are from the official results as summarized on the English
// Wikipedia page for the 2022 election; the derived ones are computed below.
const WIKI_2022 = "https://en.wikipedia.org/wiki/2022_Israeli_legislative_election";
const REGISTERED_2022 = 6_788_804;
const CAST_2022 = 4_794_593;
const INVALID_2022 = 29_851;
const VALID_2022 = 4_764_742;
const LOST_2022 = 417_400; // votes for lists that won no seat
const MERETZ_2022 = 150_793;

const fmt = (n: number) => n.toLocaleString("he-IL");
const notVoted = REGISTERED_2022 - CAST_2022;
const perSeat = Math.round((VALID_2022 - LOST_2022) / 120);
const meretzShort = Math.ceil(VALID_2022 * 0.0325) - MERETZ_2022;

const numbers = [
  { value: "70.6%", label: "הצביעו בבחירות 2022" },
  { value: `${(notVoted / 1e6).toFixed(1)} מיליון`, label: "בעלי זכות בחירה שלא הצביעו" },
  { value: `~${Math.round(perSeat / 1000)} אלף`, label: "קולות היו שווים מנדט אחד" },
  { value: fmt(meretzShort), label: "קולות חסרו למרצ כדי להיכנס לכנסת" },
];

const reasons: { title: string; body: React.ReactNode }[] = [
  {
    title: "הכנסת מחליטה על דברים שנוגעים לכולם",
    body: (
      <>
        <p>
          הכנסת שתיבחר תצביע על התקציב, על חוק הגיוס, על מערכת המשפט, על המלחמה ועל ההסדרים המדיניים. היא גם קובעת מי
          תהיה הממשלה. כל אלה ישפיעו על המחירים, על השירות הצבאי, על החינוך ועל הביטחון בארבע השנים הבאות, גם למי שלא הצביע.
        </p>
      </>
    ),
  },
  {
    title: "הבחירות מוכרעות בפערים קטנים",
    body: (
      <>
        <p>
          ב־2022 קיבלה מרצ {fmt(MERETZ_2022)} קולות, 3.16%, וחסרו לה בערך {fmt(meretzShort)} קולות כדי לעבור את אחוז
          החסימה. אילו עברה, היא הייתה מקבלת בערך 4 מנדטים, על חשבון מפלגות אחרות.
        </p>
        <p>
          ארבע המפלגות שהרכיבו את הממשלה קיבלו יחד 48.4% מהקולות הכשרים, וזה הספיק ל־64 מנדטים, כי {fmt(LOST_2022)} קולות
          הלכו לרשימות שלא עברו ולא נספרו בחלוקה. כמה אלפי קולות לכאן או לכאן יכולים לשנות את התמונה כולה.
        </p>
      </>
    ),
  },
  {
    title: "מי שלא מצביע, נותן לאחרים להחליט",
    body: (
      <p>
        המנדטים מתחלקים לפי הקולות של מי שהגיע. אם חצי מהשכונה שלך לא מצביעה, הכנסת תשקף את החצי השני. אין &quot;מחאה&quot;
        שנספרת: מי שנשאר בבית פשוט לא מופיע בתוצאות.
      </p>
    ),
  },
];

export default function WhyVotePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <h1 className="text-3xl font-extrabold sm:text-4xl">למה בכלל להצביע?</h1>
      <p className="mt-2 text-lg text-slate-300">
        כי הקול שלך שווה יותר ממה שנדמה. הנה המספרים מהבחירות הקודמות, ומה באמת קורה לפתק שאתם שמים, או לא שמים, בקלפי.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {numbers.map((n) => (
          <div key={n.label} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-center">
            <div className="text-2xl font-extrabold text-sky-300 sm:text-3xl">{n.value}</div>
            <div className="mt-1 text-sm text-slate-400">{n.label}</div>
          </div>
        ))}
      </div>

      <section className="mt-10 space-y-4">
        {reasons.map((r, i) => (
          <div key={r.title} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <h2 className="flex items-center gap-3 text-xl font-bold">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-500 text-sm text-slate-950">
                {i + 1}
              </span>
              {r.title}
            </h2>
            <div className="mt-2 space-y-2 leading-relaxed text-slate-300">{r.body}</div>
          </div>
        ))}
      </section>

      <section className="mt-10 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
        <h2 className="text-2xl font-bold">ומה עם פתק לבן?</h2>
        <div className="mt-3 space-y-2 leading-relaxed text-slate-300">
          <p>
            פתק לבן (או מעטפה ריקה) נחשב <b>קול פסול</b>. הוא לא נספר בשום מקום: לא בחלוקת המנדטים, לא בחישוב אחוז החסימה ולא
            כ״מחאה״ רשמית. ב־2022 היו {fmt(INVALID_2022)} קולות פסולים, ואף אחד מהם לא השפיע על התוצאה.
          </p>
          <p>
            מבחינת הכנסת שתיבחר, פתק לבן שווה בדיוק להישאר בבית. ההבדל היחיד הוא שהוא מעלה את אחוז ההצבעה בסטטיסטיקה.
          </p>
          <p>
            אם אף מפלגה לא מרגישה לכם מושלמת, זה נורמלי. כמעט אף אחד לא מסכים עם מפלגה בכל נושא. אפשר לבחור את זו
            שהכי קרובה אליכם בנושאים שהכי חשובים לכם, וקול כזה כן משפיע.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">אין לי למי להצביע. מאיפה מתחילים?</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Card href="/quiz" title="שאלון קצר" text="10 שאלות, ותראו איזו מפלגה הכי קרובה לעמדות שלכם." />
          <Card href="/topics" title="הנושאים" text="מה כל מפלגה אומרת על ביטחון, כלכלה, דת, גיוס ומשפט." />
          <Card href="/compare" title="השוואה" text="שתי מפלגות זו לצד זו, נושא אחרי נושא." />
        </div>
        <Link href="/towns" className="mt-3 inline-block text-sm text-sky-400 hover:underline">
          ואיך הצביעו ביישוב שלכם בפעם הקודמת? ←
        </Link>
        <p className="mt-3 text-sm text-slate-400">
          שימו לב לאחוז החסימה: קול לרשימה שלא עוברת 3.25% לא נספר בחלוקה. בעמוד של כל מפלגה מופיע כמה מנדטים היא מקבלת
          בסקרים.
        </p>
      </section>

      <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
        <h2 className="text-2xl font-bold">ביום הבחירות, 27 באוקטובר</h2>
        <ul className="mt-3 list-disc space-y-1.5 pr-5 text-slate-300">
          <li>הקלפיות פתוחות בין 07:00 ל־22:00, ויום הבחירות הוא יום שבתון.</li>
          <li>מצביעים רק בקלפי שאליה אתם משויכים, לפי הכתובת הרשומה במשרד הפנים.</li>
          <li>צריך להביא תעודה מזהה עם תמונה: תעודת זהות, דרכון או רישיון נהיגה.</li>
          <li>
            את הקלפי שלכם בודקים באתר{" "}
            <a href="https://www.bechirot.gov.il/" target="_blank" rel="noreferrer" className="text-sky-400 underline">
              ועדת הבחירות המרכזית
            </a>
            .
          </li>
        </ul>
        <Link href="/guide" className="mt-3 inline-block text-sm text-sky-400 hover:underline">
          מה קורה אחרי שסוגרים את הקלפיות ←
        </Link>
      </section>

      <p className="mt-8 text-xs text-slate-500">
        המספרים מבחירות 2022 לפי{" "}
        <a href={WIKI_2022} target="_blank" rel="noreferrer" className="underline">
          התוצאות הרשמיות כפי שהן מסוכמות בוויקיפדיה
        </a>
        . את מספר מי שלא הצביעו, שווי המנדט ומה שחסר למרצ חישבנו בעצמנו מאותם נתונים. ״בעלי זכות בחירה״ כולל גם אזרחים
        שגרים בחו״ל ולא יכולים להצביע. האתר לא ממליץ על אף מפלגה.
      </p>
    </main>
  );
}

function Card({ href, title, text }: { href: string; title: string; text: string }) {
  return (
    <Link href={href} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 transition hover:border-sky-500/60">
      <div className="font-semibold text-sky-300">{title} ←</div>
      <p className="mt-1 text-sm text-slate-400">{text}</p>
    </Link>
  );
}
