"use client";

import { AVERAGE_ID, formatDate, polls } from "@/data/polls";

export function pollLabel(pollId: string) {
  const p = polls.find((x) => x.id === pollId);
  return p ? `${p.outlet} · ${formatDate(p.date)}` : `ממוצע ${polls.length} הסקרים האחרונים`;
}

// Which poll drives the beams and the bloc bar, with a link to where the
// numbers came from.
export default function PollPicker({ pollId, onChange }: { pollId: string; onChange: (id: string) => void }) {
  const poll = polls.find((p) => p.id === pollId);

  return (
    <div>
      <label className="text-xs text-slate-400" htmlFor="poll">
        הסקר שמוצג במפה
      </label>
      <select
        id="poll"
        value={pollId}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
      >
        <option value={AVERAGE_ID}>ממוצע {polls.length} הסקרים האחרונים</option>
        {polls.map((p) => (
          <option key={p.id} value={p.id}>
            {p.outlet} · {p.pollster} · {formatDate(p.date)}
          </option>
        ))}
      </select>
      <p className="mt-1.5 text-xs text-slate-400">
        {poll ? (
          <>
            {poll.pollster} עבור {poll.outlet}, {formatDate(poll.date)}.{" "}
            <a href={poll.source} target="_blank" rel="noreferrer" className="text-sky-400 underline">
              מקור
            </a>
            {poll.article && (
              <>
                {" · "}
                <a href={poll.article} target="_blank" rel="noreferrer" className="text-sky-400 underline">
                  הכתבה המקורית
                </a>
              </>
            )}
          </>
        ) : (
          <>
            ממוצע פשוט של {polls.length} הסקרים שבטבלה למטה ({formatDate(polls.at(-1)!.date)}–
            {formatDate(polls[0].date)}), מעוגל ל־120 מנדטים.
          </>
        )}
      </p>
    </div>
  );
}
