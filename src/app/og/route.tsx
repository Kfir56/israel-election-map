import { ImageResponse } from "next/og";
import { parties } from "@/data/parties";
import { SITE_URL } from "@/lib/site";

// Link-preview images (1200x630) for sharing on WhatsApp, X, Facebook.
//   /og                         the site
//   /og?t=<title>&s=<subtitle>  any page
//   /og?quiz=<partyId>&m=<85>   a quiz result
// Satori lays out words right to left under dir="rtl" but draws the letters
// inside each word left to right, so Hebrew words are reversed here first.
// Runs of digits or Latin letters stay as they are.
const rtl = (text: string) =>
  text
    .split(" ")
    .map((w) => (/[\u0590-\u05FF]/.test(w) ? (w.match(/[0-9A-Za-z%.,:]+|./gu) ?? []).reverse().join("") : w))
    .join(" ");

export async function GET(req: Request) {
  const url = new URL(req.url);
  const font = (f: string) => fetch(new URL(`/fonts/${f}`, url)).then((r) => r.arrayBuffer());
  const [he400, he800, la400, la800] = await Promise.all([
    font("heebo-hebrew-400-normal.woff"),
    font("heebo-hebrew-800-normal.woff"),
    font("heebo-latin-400-normal.woff"),
    font("heebo-latin-800-normal.woff"),
  ]);

  const quiz = parties.find((p) => p.id === url.searchParams.get("quiz"));
  const match = Number(url.searchParams.get("m")) || null;
  const color = quiz?.color ?? "#38bdf8";
  const kicker = quiz ? "המפלגה הכי קרובה אליי" : "בחירות לכנסת ה־26 · 27 באוקטובר";
  const title = quiz ? quiz.name : (url.searchParams.get("t") ?? "המפה הפוליטית 2026");
  const sub = quiz
    ? `${match ? `${match}% התאמה · ` : ""}עשו את השאלון וגלו מה יוצא לכם`
    : (url.searchParams.get("s") ?? "המפלגות, העמדות, המועמדים והסקרים, על מפה אחת");

  return new ImageResponse(
    (
      <div
        dir="rtl"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#020617",
          color: "#f1f5f9",
          padding: "64px 72px",
          fontFamily: "Heebo",
          borderTop: `16px solid ${color}`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <div style={{ fontSize: 36, color: "#94a3b8" }}>{rtl(kicker)}</div>
          <div style={{ fontSize: title.length > 12 ? 84 : 120, fontWeight: 800, color: quiz ? color : "#f1f5f9", marginTop: 8 }}>
            {rtl(title)}
          </div>
          <div style={{ fontSize: 40, color: "#cbd5e1", marginTop: 12 }}>{rtl(sub)}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 30, color: "#64748b" }}>
          <div style={{ display: "flex" }}>{SITE_URL.replace("https://", "")}</div>
          <div style={{ display: "flex", fontWeight: 800, color: "#e2e8f0" }}>{rtl("המפה הפוליטית 2026")}</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Heebo", data: he400, weight: 400 },
        { name: "Heebo", data: he800, weight: 800 },
        { name: "Heebo", data: la400, weight: 400 },
        { name: "Heebo", data: la800, weight: 800 },
      ],
    },
  );
}
