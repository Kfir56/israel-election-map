"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { type TermId, glossary, termAnchor } from "@/data/glossary";

/** A term with a dotted underline that opens a short explanation on hover or tap. */
export default function Term({ id, children }: { id: TermId; children?: React.ReactNode }) {
  const g = glossary[id];
  const ref = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  const open = () => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const width = Math.min(288, window.innerWidth - 24);
    // Center under the term, but keep the card inside the screen.
    const left = Math.max(12, Math.min(r.left + r.width / 2 - width / 2, window.innerWidth - width - 12));
    setPos({ top: r.bottom + 2, left });
  };

  useEffect(() => {
    if (!pos) return;
    const close = (e: Event) => {
      if (e.type === "scroll" || !ref.current?.parentElement?.contains(e.target as Node)) setPos(null);
    };
    window.addEventListener("scroll", close, { passive: true });
    document.addEventListener("mousedown", close);
    return () => {
      window.removeEventListener("scroll", close);
      document.removeEventListener("mousedown", close);
    };
  }, [pos]);

  return (
    <span className="relative" onMouseLeave={() => setPos(null)}>
      <span
        ref={ref}
        role="button"
        tabIndex={0}
        aria-expanded={!!pos}
        onClick={open}
        onMouseEnter={open}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), pos ? setPos(null) : open())}
        className="cursor-help underline decoration-sky-400/70 decoration-dotted underline-offset-4"
      >
        {children ?? g.term}
      </span>
      {pos && (
        <span
          role="tooltip"
          className="fixed z-50 block w-72 max-w-[calc(100vw-24px)] rounded-xl border border-slate-700 bg-slate-900 p-3 text-start text-sm font-normal leading-relaxed text-slate-200 shadow-2xl"
          style={{ top: pos.top, left: pos.left }}
        >
          <b className="block text-sky-300">{g.term}</b>
          {g.text}
          <Link href={`/guide#${termAnchor(id)}`} className="mt-1 block text-xs text-sky-400 hover:underline">
            לכל המושגים ←
          </Link>
        </span>
      )}
    </span>
  );
}
