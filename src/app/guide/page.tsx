import Link from "next/link";
import Term from "@/components/Term";
import { type TermId, glossary, termAnchor } from "@/data/glossary";
import SeatCalculator from "@/components/SeatCalculator";

export const metadata = {
  title: "איך עובדות הבחירות · המפה הפוליטית 2026",
  description: "מהקלפי ועד הממשלה: איך מצביעים, איך סופרים, איך מחלקים מנדטים ואיך מרכיבים קואליציה.",
};

const numbers = [
  { value: "120", label: "חברי כנסת" },
  { value: "3.25%", label: "אחוז החסימה" },
  { value: "61", label: "רוב בכנסת" },
  { value: "18+", label: "גיל ההצבעה" },
];

const steps: { when: string; title: string; body: React.ReactNode }[] = [
  {
    when: "27 באוקטובר, 07:00–22:00",
    title: "ההצבעה",
    body: (
      <>
        <p>
          בישראל מצביעים לרשימה, לא לאדם. כל המדינה היא אזור בחירה אחד, וכל רשימה מציגה מראש את סדר המועמדים שלה. אם
          רשימה מקבלת 10 מנדטים, נכנסים לכנסת עשרת הראשונים בה.
        </p>
        <p>
          בקלפי מציגים תעודה מזהה, מקבלים מעטפה, בוחרים פתק אחד מאחורי הפרגוד ומכניסים אותו לקלפי. יום הבחירות הוא יום
          שבתון, וכל אזרח מגיל 18 יכול להצביע בקלפי שליד כתובת המגורים הרשומה שלו.
        </p>
      </>
    ),
  },
  {
    when: "22:00 באותו לילה",
    title: "המדגמים והספירה",
    body: (
      <>
        <p>
          כשהקלפיות נסגרות, ערוצי הטלוויזיה מפרסמים <Term id="exitPoll">״מדגמים״</Term>: סקר של אנשים שיצאו מהקלפי. זו
          עדיין לא התוצאה, והמדגם יכול לטעות בכמה מנדטים, בעיקר אצל רשימות שקרובות ל
          <Term id="threshold">אחוז החסימה</Term>.
        </p>
        <p>
          הספירה האמיתית נמשכת כל הלילה. אחריה סופרים את <Term id="doubleEnvelope">״המעטפות הכפולות״</Term> של חיילים,
          אסירים, מאושפזים ודיפלומטים, ולכן מנדט יכול לזוז גם כמה ימים אחרי הבחירות. ועדת הבחירות המרכזית מפרסמת את
          התוצאות הרשמיות כשבוע אחרי יום הבחירות.
        </p>
      </>
    ),
  },
  {
    when: "התוצאות הרשמיות",
    title: "חלוקת המנדטים",
    body: (
      <>
        <p>
          רשימה שקיבלה פחות מ־3.25% מהקולות הכשרים לא נכנסת לכנסת, והקולות שלה לא נספרים בחלוקה. את 120 המנדטים מחלקים
          רק בין הרשימות שעברו, לפי חלקן היחסי.
        </p>
        <p>
          כמעט תמיד נשארים כמה מנדטים ״שבורים״. אותם מחלקים ב<Term id="baderOfer">שיטת בדר-עופר</Term>, ושתי רשימות
          שחתמו ביניהן על <Term id="surplus">״הסכם עודפים״</Term> נספרות בשלב הזה כרשימה אחת. אפשר לנסות את זה במחשבון
          למטה.
        </p>
      </>
    ),
  },
  {
    when: "עד 7 ימים אחרי פרסום התוצאות",
    title: "ההתייעצויות אצל הנשיא",
    body: (
      <p>
        נשיא המדינה נפגש עם נציגי כל הסיעות, ושואל כל אחת את מי היא ממליצה להרכיב את הממשלה. אחר כך הוא מטיל את התפקיד
        על חבר הכנסת שיש לו את הסיכוי הטוב ביותר להצליח. בדרך כלל זה ראש הרשימה הגדולה, אבל לא חייב: הקובע הוא מי מקבל
        יותר המלצות.
      </p>
    ),
  },
  {
    when: "28 ימים, ועוד עד 14",
    title: "הרכבת הקואליציה",
    body: (
      <>
        <p>
          מי שקיבל את המנדט מנהל משא ומתן עם מפלגות אחרות: מי יקבל אילו משרדים, אילו חוקים יעברו ואילו לא. מה שמסכמים
          נכתב ב״הסכמים הקואליציוניים״. המפלגות שנכנסות לממשלה הן <Term id="coalition">הקואליציה</Term>, וכל השאר הם{" "}
          <Term id="opposition">האופוזיציה</Term>.
        </p>
        <p>
          אם הוא לא מצליח, הנשיא יכול להטיל את התפקיד על מישהו אחר ל־28 ימים נוספים. אם גם זה נכשל, יש 21 ימים שבהם רוב
          חברי הכנסת יכולים לבקש מהנשיא מועמד מסוים. אם אף אחד לא מצליח, הולכים לבחירות חדשות, כמו שקרה פעמיים ב־2019.
        </p>
      </>
    ),
  },
  {
    when: "כשיש הסכמים",
    title: "השבעת הממשלה",
    body: (
      <p>
        הממשלה מוצגת בכנסת, והכנסת מצביעה אם היא נותנת בה אמון. מספיק שיותר חברי כנסת יצביעו בעד מאשר נגד, אבל ממשלה בלי
        61 תומכים (״ממשלת מיעוט״) תלויה בכל הצבעה במי שלא נמצא בקואליציה. לכן בפועל כמעט כל ראש ממשלה מחפש 61 לפחות.
      </p>
    ),
  },
];

export default function GuidePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <h1 className="text-3xl font-extrabold sm:text-4xl">איך עובדות הבחירות?</h1>
      <p className="mt-2 text-lg text-slate-300">מהפתק בקלפי ועד הממשלה החדשה, צעד אחרי צעד.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {numbers.map((n) => (
          <div key={n.label} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-center">
            <div dir="ltr" className="text-3xl font-extrabold text-sky-300">
              {n.value}
            </div>
            <div className="mt-1 text-sm text-slate-400">{n.label}</div>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">מהקלפי ועד הממשלה</h2>
        <ol className="relative mt-5 border-r-2 border-slate-800 pr-6">
          {steps.map((s, i) => (
            <li key={s.title} className="relative mb-8">
              <span className="absolute -right-[39px] top-0 flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-slate-950">
                {i + 1}
              </span>
              <div className="text-xs font-semibold text-sky-400">{s.when}</div>
              <h3 className="mt-0.5 text-xl font-bold">{s.title}</h3>
              <div className="mt-2 space-y-2 leading-relaxed text-slate-300">{s.body}</div>
            </li>
          ))}
        </ol>
      </section>

      <section id="calculator" className="mt-6 scroll-mt-20">
        <h2 className="text-2xl font-bold">מחשבון מנדטים</h2>
        <p className="mt-1 mb-4 text-slate-400">
          שנו את אחוזי ההצבעה ותראו איך המנדטים מתחלקים בפועל, כולל אחוז החסימה ושיטת בדר-עופר. נסו להוריד רשימה מתחת
          ל־3.25% ולראות לאן הולכים המנדטים שלה.
        </p>
        <SeatCalculator />
        <p className="mt-2 text-xs text-slate-500">
          החישוב לפי חוק הבחירות לכנסת (שיטת בדר-עופר עם הסכמי עודפים). בדקנו אותו מול תוצאות בחירות 2022 והוא מחזיר
          בדיוק את חלוקת הכנסת ה־25.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">מילון מושגים</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          {(Object.keys(glossary) as TermId[]).map((id) => (
            <div
              key={id}
              id={termAnchor(id)}
              className="scroll-mt-20 rounded-xl border border-slate-800 bg-slate-900/40 p-4 target:border-sky-500"
            >
              <dt className="font-semibold">{glossary[id].term}</dt>
              <dd className="mt-1 text-sm text-slate-300">{glossary[id].text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-10 flex flex-wrap gap-2">
        <Link href="/" className="rounded-xl border border-slate-700 px-5 py-2.5 font-semibold hover:bg-slate-800">
          חזרה למפה
        </Link>
        <Link
          href="/predict"
          className="rounded-xl bg-sky-500 px-5 py-2.5 font-semibold text-slate-950 hover:bg-sky-400"
        >
          עכשיו לחזות את התוצאות
        </Link>
      </div>
      <p className="mt-6 text-xs text-slate-500">
        מבוסס על חוק־יסוד: הכנסת, חוק־יסוד: הממשלה וחוק הבחירות לכנסת, כפי שהם מוסברים באתר{" "}
        <a className="underline" href="https://www.idi.org.il/policy/parties-and-elections/">
          המכון הישראלי לדמוקרטיה
        </a>
        . הסבר כללי ולא ייעוץ משפטי.
      </p>
    </main>
  );
}
