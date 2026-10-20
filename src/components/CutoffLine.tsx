// A full-width dashed line inside a candidate list, where the poll average cuts it.
export default function CutoffLine({ label }: { label: string }) {
  return (
    <li className="col-span-full flex items-center gap-3 py-1 text-xs font-semibold text-amber-300">
      <span className="h-px flex-1 border-t-2 border-dashed border-amber-400/70" />
      {label}
      <span className="h-px flex-1 border-t-2 border-dashed border-amber-400/70" />
    </li>
  );
}
