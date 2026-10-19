"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";

const input =
  "w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 outline-none placeholder:text-slate-500 focus:border-sky-500";

// Supabase error messages are English; show the common ones in Hebrew.
function hebrewError(message: string) {
  if (/invalid login credentials/i.test(message)) return "האימייל או הסיסמה לא נכונים.";
  if (/already registered/i.test(message)) return "כבר יש חשבון עם האימייל הזה. נסו להתחבר.";
  if (/password should be at least/i.test(message)) return "הסיסמה צריכה להיות באורך 6 תווים לפחות.";
  if (/email not confirmed/i.test(message)) return "צריך לאשר את האימייל קודם. חפשו את המייל ששלחנו.";
  if (/rate limit/i.test(message)) return "יותר מדי ניסיונות. נסו שוב בעוד כמה דקות.";
  if (/provider is not enabled/i.test(message)) return "ההתחברות עם גוגל עוד לא הופעלה באתר. אפשר בינתיים להירשם עם אימייל.";
  return message;
}

export default function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next")?.startsWith("/") ? params.get("next")! : "/predict";
  const router = useRouter();
  const { user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (user) router.replace(next);
  }, [user, next, router]);

  const google = async () => {
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) setError(hebrewError(error.message));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(hebrewError(error.message));
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: name.trim(), username: username.trim().toLowerCase() },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) setError(hebrewError(error.message));
      else if (!data.session) setNotice("שלחנו לכם מייל לאישור החשבון. אחרי הלחיצה על הקישור תחזרו לכאן מחוברים.");
    }
    setBusy(false);
  };

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
        <h1 className="text-center text-2xl font-extrabold">{mode === "signin" ? "התחברות" : "הרשמה"}</h1>
        <p className="mt-1 text-center text-sm text-slate-400">
          חזו כמה מנדטים כל מפלגה תקבל, והשוו עם החברים. משחק בנקודות בלבד, בלי כסף.
        </p>

        <button
          onClick={google}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-white py-2.5 font-semibold text-slate-900 hover:bg-slate-100"
        >
          <GoogleIcon />
          המשך עם גוגל
        </button>

        <div className="my-5 flex items-center gap-3 text-xs text-slate-500">
          <div className="h-px flex-1 bg-slate-800" />
          או עם אימייל
          <div className="h-px flex-1 bg-slate-800" />
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <>
              <input className={input} placeholder="השם שיוצג לחברים" value={name} onChange={(e) => setName(e.target.value)} required maxLength={40} />
              <input
                className={input}
                dir="ltr"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
                required
                minLength={3}
                maxLength={20}
              />
            </>
          )}
          <input className={input} dir="ltr" type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input
            className={input}
            dir="ltr"
            type="password"
            placeholder="••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          {error && <p className="rounded-lg bg-rose-500/10 p-2 text-sm text-rose-300">{error}</p>}
          {notice && <p className="rounded-lg bg-emerald-500/10 p-2 text-sm text-emerald-300">{notice}</p>}
          <button disabled={busy} className="w-full rounded-xl bg-sky-500 py-2.5 font-semibold text-slate-950 hover:bg-sky-400 disabled:opacity-60">
            {busy ? "רגע…" : mode === "signin" ? "התחברות" : "יצירת חשבון"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-400">
          {mode === "signin" ? "אין לכם חשבון?" : "כבר רשומים?"}{" "}
          <button
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError("");
              setNotice("");
            }}
            className="font-semibold text-sky-400 hover:underline"
          >
            {mode === "signin" ? "להרשמה" : "להתחברות"}
          </button>
        </p>
      </div>
      <p className="mt-4 text-center text-xs text-slate-500">
        אנחנו שומרים רק שם, שם משתמש והחיזויים שלכם. האימייל לא מוצג לאף אחד.{" "}
        <Link href="/" className="underline">
          חזרה למפה
        </Link>
      </p>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}
