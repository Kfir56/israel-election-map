// The letters on the party's ballot slip, drawn like the slip itself.
export default function BallotLetter({ letter, size = "md" }: { letter: string; size?: "sm" | "md" }) {
  return (
    <span
      title="האותיות על פתק ההצבעה"
      className={`inline-flex shrink-0 items-center justify-center rounded-md border border-slate-300 bg-white font-black text-slate-950 shadow ${
        size === "sm" ? "h-7 min-w-9 px-1.5 text-sm" : "h-10 min-w-12 px-2 text-xl"
      }`}
    >
      {letter}
    </span>
  );
}
