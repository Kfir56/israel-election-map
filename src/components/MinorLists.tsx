import BallotLetter from "@/components/BallotLetter";
import minorLists from "@/data/minor-lists.json";
import { formatSourceDate } from "@/data/parties";
import Term from "@/components/Term";

type MinorList = {
  letter: string;
  name: string;
  head: string | null;
  description: string | null;
  website: string | null;
  source: string;
  date: string;
  note: string | null;
};

// The lists that run but don't show up in any poll. Kept short on purpose.
export default function MinorLists() {
  const lists = minorLists as MinorList[];
  return (
    <section id="minor" className="mt-12 scroll-mt-20">
      <h2 className="text-2xl font-bold">עוד {lists.length} רשימות שמתמודדות</h2>
      <p className="mt-1 max-w-3xl text-slate-400">
        בבחירות מתמודדות 38 רשימות. אלה שלמטה לא מגיעות ל<Term id="threshold">אחוז החסימה</Term> באף סקר שמצאנו, ולכן הן
        לא מופיעות על המפה. קול לרשימה שלא עוברת 3.25% לא נספר בחלוקת המנדטים.
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {lists.map((l) => (
          <li key={l.letter} className="flex gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
            <BallotLetter letter={l.letter} size="sm" />
            <div className="min-w-0 text-sm">
              <div className="font-semibold">{l.name}</div>
              {l.head && <div className="text-xs text-slate-400">בראשות {l.head}</div>}
              <p className="mt-1 text-slate-300">
                {l.description ?? <span className="text-slate-500">לא מצאנו מידע אמין מעבר לשם.</span>}
              </p>
              {l.note && <p className="mt-1 text-xs text-slate-500">{l.note}</p>}
              <div className="mt-1 flex gap-3 text-xs text-slate-500">
                <a href={l.source} target="_blank" rel="noreferrer" className="hover:text-sky-300">
                  מקור · {formatSourceDate(l.date)}
                </a>
                {l.website && (
                  <a href={l.website} target="_blank" rel="noreferrer" className="hover:text-sky-300">
                    אתר הרשימה
                  </a>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-slate-500">
        אותיות הפתק לפי{" "}
        <a
          href="https://www.ynet.co.il/news/elections2026/article/sjmed8uqgx"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          ynet, 27.9.2026
        </a>
        . ראשי הרשימות לפי רשימות המועמדים הרשמיות. התיאורים בתמצות שלנו, ולצד כל אחד המקור שלו.
      </p>
    </section>
  );
}
