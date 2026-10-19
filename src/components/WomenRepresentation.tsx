import Link from "next/link";
import { WOMEN_25, WOMEN_25_SOURCE, sexOf, womenStats } from "@/data/gender";
import { parties } from "@/data/parties";
import { partyHref } from "@/data/people";
import { averageSeats, polls } from "@/data/polls";

// Women on each list, and how many sit in the places the poll average says
// the list will win.
export default function WomenRepresentation() {
  const rows = [...parties]
    .map((p) => ({ p, s: womenStats(p.id, Math.min(averageSeats[p.id] ?? 0, p.candidates.length)) }))
    .sort((a, b) => (averageSeats[b.p.id] ?? 0) - (averageSeats[a.p.id] ?? 0));
  const women = rows.reduce((n, r) => n + r.s.womenRealistic, 0);
  const seats = rows.reduce((n, r) => n + r.s.realistic, 0);

  return (
    <section id="women" className="mt-12 scroll-mt-20">
      <h2 className="text-2xl font-bold">ייצוג נשים</h2>
      <p className="mt-1 max-w-3xl text-slate-400">
        לפי ממוצע {polls.length} הסקרים, <b className="text-slate-100">{women}</b> נשים יושבות במקומות הריאליים, מתוך {seats}{" "}
        המקומות שאנחנו מכירים (מכל רשימה פרסמנו רק את המקומות הראשונים). בכנסת היוצאת נבחרו{" "}
        <a href={WOMEN_25_SOURCE} target="_blank" rel="noreferrer" className="text-sky-400 underline">
          {WOMEN_25} נשים
        </a>{" "}
        מתוך 120.
      </p>
      <ul className="mt-4 space-y-2">
        {rows.map(({ p, s }) => (
          <li key={p.id} className="grid grid-cols-[7.5rem_1fr_auto] items-center gap-3 text-sm sm:grid-cols-[12rem_1fr_13rem]">
            <Link href={partyHref(p.id)} className="flex items-center gap-2 truncate font-semibold hover:text-sky-300">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: p.color }} />
              {p.name}
            </Link>
            <div className="flex h-4 gap-px overflow-hidden rounded" title={`${s.women} נשים מתוך ${s.total} המקומות הראשונים`}>
              {p.candidates.map((c, i) => {
                const sex = sexOf(p.id, c.pos, c.name);
                const realistic = i < s.realistic;
                return (
                  <span
                    key={c.pos}
                    className="flex-1"
                    style={{
                      background: sex === "f" ? "#f472b6" : sex === "?" ? "#64748b" : "#334155",
                      opacity: realistic ? 1 : 0.35,
                    }}
                  />
                );
              })}
            </div>
            <span className="text-left text-xs text-slate-400">
              <b className="text-slate-100">{s.womenRealistic}</b> מתוך {s.realistic} ריאליים · {s.women} ברשימה
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-slate-500">
        כל משבצת היא מקום ברשימה, מימין לשמאל. ורוד = מועמדת. משבצות כהות = מקומות שהרשימה מקבלת לפי ממוצע הסקרים. את
        המועמדות זיהינו לפי השם, ובשמות שמתאימים לשני המינים לפי הרקע של המועמד או המועמדת. ב־4 מקומות (משבצת אפורה בהירה) לא
        הצלחנו לוודא, והם לא נספרו.
      </p>
    </section>
  );
}
