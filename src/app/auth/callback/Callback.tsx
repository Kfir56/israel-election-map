"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

// Google and the confirmation email land here; supabase-js swaps the code in
// the URL for a session on its own, then we move on.
export default function Callback() {
  const params = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const next = params.get("next")?.startsWith("/") ? params.get("next")! : "/predict";
  const error = params.get("error_description");

  useEffect(() => {
    if (user) router.replace(next);
  }, [user, next, router]);

  return (
    <main className="mx-auto max-w-md px-4 py-24 text-center">
      {error ? (
        <>
          <p className="text-rose-300">ההתחברות לא הצליחה: {error}</p>
          <Link href="/login" className="mt-4 inline-block text-sky-400 underline">
            לנסות שוב
          </Link>
        </>
      ) : (
        <p className="text-slate-400">מחברים אתכם…</p>
      )}
    </main>
  );
}
