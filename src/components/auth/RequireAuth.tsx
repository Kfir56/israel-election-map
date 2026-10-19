"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

// Shows the page only to signed-in users, and a sign-in card to everyone else.
export default function RequireAuth({ title, children }: { title: string; children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const path = usePathname();
  if (loading) return <div className="py-24 text-center text-slate-500">טוען…</div>;
  if (user) return <>{children}</>;
  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-slate-400">צריך להתחבר כדי לראות את העמוד הזה. זה חינם, ואין כאן כסף אמיתי.</p>
      <Link
        href={`/login?next=${encodeURIComponent(path)}`}
        className="mt-6 inline-block rounded-xl bg-sky-500 px-6 py-2.5 font-semibold text-slate-950 hover:bg-sky-400"
      >
        התחברות או הרשמה
      </Link>
    </div>
  );
}
