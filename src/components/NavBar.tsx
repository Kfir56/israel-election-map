"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { ELECTION_DAY } from "@/lib/supabase";

const links = [
  { href: "/", label: "המפה" },
  { href: "/parties", label: "המפלגות" },
  { href: "/topics", label: "הנושאים" },
  { href: "/quiz", label: "שאלון" },
  { href: "/guide", label: "איך זה עובד" },
  { href: "/coalitions", label: "קואליציות" },
  { href: "/why-vote", label: "למה להצביע" },
  { href: "/predict", label: "החיזוי שלי" },
  { href: "/friends", label: "חברים" },
  { href: "/dashboard", label: "הלוח של החברים" },
];

function daysLeft() {
  return Math.ceil((ELECTION_DAY.getTime() - Date.now()) / 86_400_000);
}

export default function NavBar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  // The countdown depends on the clock, so render it only in the browser.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const days = mounted ? daysLeft() : null;

  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-extrabold">
          <Logo />
          <span className="hidden sm:inline">המפה הפוליטית</span>
          <span className="rounded bg-sky-500/15 px-1.5 text-xs font-bold text-sky-300">2026</span>
        </Link>

        <div className="hidden flex-1 items-center gap-0.5 xl:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-sm transition ${
                active(l.href) ? "bg-slate-800 font-semibold text-white" : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="ms-auto flex items-center gap-3">
          {days !== null && days > 0 && (
            <span className="hidden rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs text-amber-200 2xl:inline">
              עוד {days} ימים לבחירות
            </span>
          )}
          <AccountMenu />
          <button
            onClick={() => setOpen((o) => !o)}
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 xl:hidden"
            aria-label="תפריט"
            aria-expanded={open}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M4 4l12 12M16 4L4 16" /> : <path d="M3 5h14M3 10h14M3 15h14" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-slate-800 px-4 py-2 xl:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-3 py-2.5 ${active(l.href) ? "bg-slate-800 font-semibold" : "text-slate-300"}`}
            >
              {l.label}
            </Link>
          ))}
          {days !== null && days > 0 && <p className="px-3 py-2 text-xs text-amber-200">עוד {days} ימים לבחירות</p>}
        </div>
      )}
    </header>
  );
}

function AccountMenu() {
  const { user, profile, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  if (loading) return <div className="h-8 w-8 animate-pulse rounded-full bg-slate-800" />;
  if (!user)
    return (
      <Link
        href={`/login?next=${encodeURIComponent(path)}`}
        className="rounded-lg bg-sky-500 px-3 py-1.5 text-sm font-semibold text-slate-950 hover:bg-sky-400"
      >
        התחברות
      </Link>
    );

  const name = profile?.display_name ?? user.email ?? "";
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 rounded-full hover:opacity-90" aria-label="החשבון שלי">
        <Avatar name={name} url={profile?.avatar_url} />
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-xl">
          <div className="border-b border-slate-800 px-4 py-3">
            <div className="truncate font-semibold">{name}</div>
            {profile && (
              <div dir="ltr" className="truncate text-right text-xs text-slate-400">
                @{profile.username}
              </div>
            )}
          </div>
          <Link href="/predict" className="block px-4 py-2 text-sm hover:bg-slate-800">
            החיזוי שלי
          </Link>
          <Link href="/friends" className="block px-4 py-2 text-sm hover:bg-slate-800">
            חברים והפרופיל שלי
          </Link>
          <button
            onClick={async () => {
              setOpen(false);
              await signOut();
              router.push("/");
            }}
            className="block w-full border-t border-slate-800 px-4 py-2 text-right text-sm text-rose-300 hover:bg-slate-800"
          >
            התנתקות
          </button>
        </div>
      )}
    </div>
  );
}

export function Avatar({ name, url, size = 32 }: { name: string; url?: string | null; size?: number }) {
  if (url)
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="" width={size} height={size} className="rounded-full" referrerPolicy="no-referrer" />;
  return (
    <span
      className="flex items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 font-bold text-white"
      style={{ width: size, height: size, fontSize: size * 0.45 }}
    >
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}

function Logo() {
  // Three bars rising from a base, like the beams on the map.
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden>
      <rect x="1" y="1" width="24" height="24" rx="7" fill="#0f172a" stroke="#334155" />
      <rect x="6" y="12" width="3.5" height="8" rx="1" fill="#38bdf8" />
      <rect x="11.25" y="6" width="3.5" height="14" rx="1" fill="#818cf8" />
      <rect x="16.5" y="9" width="3.5" height="11" rx="1" fill="#2dd4bf" />
    </svg>
  );
}
