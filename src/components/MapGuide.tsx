"use client";

import { useSyncExternalStore } from "react";

const KEY = "map-guide-hidden";
const listeners = new Set<() => void>();

function readHidden() {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}
function setHidden(hidden: boolean) {
  try {
    if (hidden) localStorage.setItem(KEY, "1");
    else localStorage.removeItem(KEY);
  } catch {}
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

// "How to read the map": four short steps above the 3D map. It can be folded
// away, and stays folded for that visitor.
export default function MapGuide() {
  const hidden = useSyncExternalStore(subscribe, readHidden, () => false);

  if (hidden)
    return (
      <button onClick={() => setHidden(false)} className="mb-3 text-sm text-sky-400 hover:underline">
        ❓ איך קוראים את המפה?
      </button>
    );

  return (
    <section className="mb-4 rounded-2xl border border-sky-500/20 bg-gradient-to-l from-sky-500/10 via-slate-900/40 to-indigo-500/10 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-bold">איך קוראים את המפה?</h2>
        <button onClick={() => setHidden(true)} className="shrink-0 rounded-lg px-2 py-1 text-sm text-slate-400 hover:bg-slate-800 hover:text-white">
          הבנתי, להסתיר
        </button>
      </div>
      <ol className="mt-3 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <Step icon={<BeamIcon />} title="כל עמוד אור הוא מפלגה">
          לחיצה על עמוד או על השם שלו פותחת את העמדות, הרשימה והסקרים של המפלגה.
        </Step>
        <Step icon={<HeightIcon />} title="גובה העמוד = מנדטים">
          כמה מנדטים המפלגה מקבלת בסקר שבחרתם בצד. אפשר להחליף סקר ולראות איך העמודים זזים.
        </Step>
        <Step icon={<LeftRightIcon />} title="מערב ↔ מזרח = שמאל ↔ ימין">
          בנושאי ביטחון ומדיני: מפלגות שמאל קרובות לים, מפלגות ימין במזרח.
        </Step>
        <Step icon={<UpDownIcon />} title="צפון ↕ דרום = דתי ↕ חילוני">
          ככל שמפלגה צפונית יותר, היא דתית יותר בנושאי דת ומדינה.
        </Step>
      </ol>
      <p className="mt-3 text-xs text-slate-400">
        המיקום על המפה הוא רק דרך להראות איפה המפלגות עומדות זו ביחס לזו. הוא לא אומר איפה הבוחרים שלהן גרים, והוא הערכה שלנו ולא
        נתון רשמי. רוצים לשחק? לחצו על ״👑 נסו להרכיב קואליציה״ וצרפו מפלגות עד 61.
      </p>
    </section>
  );
}

function Step({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <li className="flex flex-col gap-2 rounded-xl bg-slate-950/50 p-3 sm:flex-row sm:gap-3">
      <div className="shrink-0">{icon}</div>
      <div>
        <div className="text-sm font-semibold sm:text-base">{title}</div>
        <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">{children}</p>
      </div>
    </li>
  );
}

const box = { width: 44, height: 44, viewBox: "0 0 44 44", "aria-hidden": true } as const;

function BeamIcon() {
  return (
    <svg {...box}>
      <rect width="44" height="44" rx="10" fill="#0f172a" />
      <ellipse cx="22" cy="34" rx="9" ry="3" fill="none" stroke="#38bdf8" strokeOpacity=".6" />
      <rect x="19" y="9" width="6" height="25" rx="3" fill="#38bdf8" />
      <circle cx="22" cy="9" r="4" fill="#bae6fd" />
    </svg>
  );
}
function HeightIcon() {
  return (
    <svg {...box}>
      <rect width="44" height="44" rx="10" fill="#0f172a" />
      <rect x="9" y="24" width="6" height="12" rx="2" fill="#2dd4bf" />
      <rect x="19" y="10" width="6" height="26" rx="2" fill="#818cf8" />
      <rect x="29" y="18" width="6" height="18" rx="2" fill="#f472b6" />
    </svg>
  );
}
function LeftRightIcon() {
  return (
    <svg {...box}>
      <rect width="44" height="44" rx="10" fill="#0f172a" />
      <path d="M8 22h28M8 22l5-5M8 22l5 5M36 22l-5-5M36 22l-5 5" stroke="#e2e8f0" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}
function UpDownIcon() {
  return (
    <svg {...box}>
      <rect width="44" height="44" rx="10" fill="#0f172a" />
      <path d="M22 8v28M22 8l-5 5M22 8l5 5M22 36l-5-5M22 36l5-5" stroke="#e2e8f0" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}
