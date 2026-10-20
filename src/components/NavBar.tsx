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
  { href: "/results", label: "תוצאות" },
  { href: "/why-vote", label: "למה להצביע" },
  { href: "/election-day", label: "יום הבחירות" },
  { href: "/predict", label: "החיזוי שלי" },
];

// The translated sections cover the explainer pages; the game and friends stay Hebrew.
type Lang = "he" | "ar" | "en" | "ru";
const intl: Record<
  Exclude<Lang, "he">,
  { name: string; days: (n: number) => string; menu: string; links: { href: string; label: string }[] }
> = {
  ar: {
    name: "الخريطة السياسية",
    days: (n) => `${n} أيام حتى الانتخابات`,
    menu: "القائمة",
    links: [
      { href: "/ar", label: "الأحزاب" },
      { href: "/ar/towns", label: "نتائج 2022 حسب البلدة" },
      { href: "/ar/why-vote", label: "لماذا نصوّت" },
    ],
  },
  en: {
    name: "Political Map",
    days: (n) => `${n} days to the election`,
    menu: "Menu",
    links: [
      { href: "/en", label: "Parties" },
      { href: "/en/towns", label: "2022 results by town" },
      { href: "/en/why-vote", label: "Why vote" },
    ],
  },
  ru: {
    name: "Политическая карта",
    days: (n) => `До выборов дней: ${n}`,
    menu: "Меню",
    links: [
      { href: "/ru", label: "Партии" },
      { href: "/ru/towns", label: "Итоги 2022 по городам" },
      { href: "/ru/why-vote", label: "Зачем голосовать" },
    ],
  },
};
const languages: { lang: Lang; href: string; label: string; short: string }[] = [
  { lang: "he", href: "/", label: "עברית", short: "עב" },
  { lang: "ar", href: "/ar", label: "العربية", short: "ع" },
  { lang: "en", href: "/en", label: "English", short: "EN" },
  { lang: "ru", href: "/ru", label: "Русский", short: "RU" },
];
const langOf = (path: string): Lang =>
  (["ar", "en", "ru"] as const).find((l) => path === `/${l}` || path.startsWith(`/${l}/`)) ?? "he";

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

  const lang = langOf(path);
  const t = lang === "he" ? null : intl[lang];
  const shown = t ? t.links : links;
  const home = t ? t.links[0].href : "/";
  const active = (href: string) => (href === home ? path === href : path.startsWith(href));
  const countdown = (n: number) => (t ? t.days(n) : `עוד ${n} ימים לבחירות`);

  return (
    <header
      dir={lang === "en" || lang === "ru" ? "ltr" : "rtl"}
      lang={lang}
      className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md"
    >
      <nav className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href={home} className="flex shrink-0 items-center gap-2 font-extrabold">
          <Logo />
          <span className="hidden sm:inline">{t ? t.name : "המפה הפוליטית"}</span>
          <span className="rounded bg-sky-500/15 px-1.5 text-xs font-bold text-sky-300">2026</span>
        </Link>

        <div className="hidden flex-1 items-center gap-0.5 xl:flex">
          {shown.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-sm transition ${
                active(l.href)
                  ? "bg-slate-800 font-semibold text-white"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="ms-auto flex items-center gap-3">
          {days !== null && days > 0 && (
            <span className="hidden rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs text-amber-200 2xl:inline">
              {countdown(days)}
            </span>
          )}
          <LanguageMenu lang={lang} />
          {lang === "he" && <AccountMenu />}
          <button
            onClick={() => setOpen((o) => !o)}
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 xl:hidden"
            aria-label={t ? t.menu : "תפריט"}
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
          {shown.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-3 py-2.5 ${active(l.href) ? "bg-slate-800 font-semibold" : "text-slate-300"}`}
            >
              {l.label}
            </Link>
          ))}
          {days !== null && days > 0 && <p className="px-3 py-2 text-xs text-amber-200">{countdown(days)}</p>}
        </div>
      )}
    </header>
  );
}

function LanguageMenu({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const current = languages.find((l) => l.lang === lang)!;
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Language / שפה / اللغة / Язык"
        className="flex items-center gap-1 whitespace-nowrap rounded-lg border border-slate-700 px-2.5 py-1 text-sm text-slate-300 hover:border-sky-500/60 hover:text-white"
      >
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <circle cx="10" cy="10" r="8" />
          <path d="M2 10h16M10 2c2.5 2.5 2.5 13.5 0 16M10 2c-2.5 2.5-2.5 13.5 0 16" />
        </svg>
        {current.short}
      </button>
      {open && (
        <div className="absolute end-0 mt-2 w-36 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-xl">
          {languages.map((l) => (
            <Link
              key={l.lang}
              href={l.href}
              lang={l.lang}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2 text-sm hover:bg-slate-800 ${l.lang === lang ? "font-semibold text-sky-300" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </div>
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
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full hover:opacity-90"
        aria-label="החשבון שלי"
      >
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
          <Link href="/dashboard" className="block px-4 py-2 text-sm hover:bg-slate-800">
            הלוח של החברים
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
