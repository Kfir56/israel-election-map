import surplus from "@/data/surplus.json";
import { parties } from "@/data/parties";
import { averageSeats, formatDate } from "@/data/polls";
import { colorOnDark } from "@/lib/party-color";
import Term from "@/components/Term";

const name = (id: string) => parties.find((p) => p.id === id)?.name ?? id;

function Src({ href, date }: { href: string; date: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="whitespace-nowrap text-xs text-sky-400 hover:underline">
      מקור, {formatDate(date)}
    </a>
  );
}

// Who signed a surplus-vote agreement with whom, and whether it would count
// on today's poll average (both lists have to pass the threshold).
export default function SurplusAgreements() {
  return (
    <section id="surplus" className="mt-10 scroll-mt-20">
      <h2 className="text-2xl font-bold">
        <Term id="surplus">הסכמי עודפים</Term>
      </h2>
      <p className="mt-1 text-slate-300">
        אחרי שמחלקים את המנדטים השלמים נשארים &quot;עודפים&quot; של קולות. שתי רשימות שחתמו על הסכם נספרות יחד בחלוקת
        העודפים, וכך אחת מהן יכולה לקבל מנדט נוסף. בדרך כלל מדובר במנדט אחד לכל היותר, אבל בבחירות צמודות גם זה משנה.{" "}
        <span className="text-slate-400">
          {surplus.rule.text} <Src href={surplus.rule.source} date={surplus.deadline?.date ?? ""} />
        </span>
      </p>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {surplus.agreements.map((a) => {
          const both = (averageSeats[a.a] ?? 0) > 0 && (averageSeats[a.b] ?? 0) > 0;
          return (
            <li key={a.a + a.b} className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 text-sm">
              <div className="flex flex-wrap items-center gap-x-2 font-semibold">
                {[a.a, a.b].map((id, i) => (
                  <span key={id} className="flex items-center gap-1.5">
                    {i > 0 && <span className="text-slate-500">+</span>}
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: colorOnDark(id) }} />
                    {name(id)}
                  </span>
                ))}
              </div>
              <p className="mt-1 text-slate-400">
                {a.text} <Src href={a.source} date={a.date} />
              </p>
              <p className={`mt-1 text-xs ${both ? "text-emerald-300" : "text-amber-300"}`}>
                {both
                  ? "לפי ממוצע הסקרים שתיהן עוברות, אז ההסכם ייספר"
                  : "לפי ממוצע הסקרים אחת מהן לא עוברת, אז ההסכם לא ייספר"}
              </p>
            </li>
          );
        })}
      </ul>

      <h3 className="mt-5 font-semibold text-slate-200">בלי הסכם</h3>
      <ul className="mt-2 space-y-1 text-sm text-slate-400">
        {surplus.unsigned.map((u) => (
          <li key={u.party}>
            <b className="text-slate-200">{name(u.party)}:</b> {u.text} <Src href={u.source} date={u.date} />
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-slate-500">
        המועד האחרון לחתימה היה 16 באוקטובר. התאריכים הם מועדי הדיווח בעיתונות, לא מועדי ההגשה לוועדת הבחירות, שהאתר שלה
        לא היה זמין לנו לבדיקה.
      </p>
    </section>
  );
}
