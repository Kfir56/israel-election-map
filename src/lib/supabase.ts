import { createClient } from "@supabase/supabase-js";

// The URL and publishable key are public by design (they ship to the
// browser); row level security in the database decides who sees what.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://wfxotfqfgwtmhsnnobut.supabase.co";
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_1owtZSCp2-4ypIQO_AAYZw_kwtYuRqH";

export const supabase = createClient(url, key, {
  auth: { flowType: "pkce", detectSessionInUrl: true, persistSession: true },
});

export type Profile = { id: string; username: string; display_name: string; avatar_url: string | null };
export type Prediction = { user_id: string; party_id: string; seats: number };

// Polls open at 07:00 Israel time; the database locks predictions then too.
export const PREDICTIONS_LOCK = new Date("2026-10-27T05:00:00Z");
export const ELECTION_DAY = new Date("2026-10-27T05:00:00Z");
