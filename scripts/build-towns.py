"""Builds public/data/towns-2022.json from the CEC per-locality results.

Input: scripts/results-2022/localities.json (CEC expc.csv for Knesset 25, see
meta.json for the source) and names-ar.json (our Arabic names, optional).
Each town row: [code, he, en, ar, registered, cast, valid, votes...] where the
votes line up with `lists`, and the last number is every other list combined.
"""
import json, os

D = "scripts/results-2022"
towns = json.load(open(f"{D}/localities.json"))
ar_path = f"{D}/names-ar.json"
names_ar = json.load(open(ar_path)) if os.path.exists(ar_path) else {}

# The 13 lists that won seats or came close, with what they are in 2026.
LISTS = [
    ("מחל", "הליכוד", "الليكود", "#1d4ed8", "likud"),
    ("פה", "יש עתיד", "يش عتيد", "#0ea5e9", "together"),
    ("ט", "הציונות הדתית", "الصهيونية الدينية", "#b45309", "rzp,otzma"),
    ("כן", "המחנה הממלכתי", "المعسكر الرسمي", "#6366f1", "bw,yashar"),
    ("שס", "ש״ס", "شاس", "#e7e5e4", "shas"),
    ("ג", "יהדות התורה", "يهدوت هتوراه", "#a8a29e", "utj"),
    ("ל", "ישראל ביתנו", "يسرائيل بيتينو", "#16a34a", "yb"),
    ("עם", "רע״מ", "القائمة الموحدة", "#15803d", "raam"),
    ("ום", "חד״ש-תע״ל", "الجبهة والعربية للتغيير", "#be123c", "joint"),
    ("אמת", "העבודה", "العمل", "#dc2626", "dems"),
    ("מרצ", "מרצ", "ميرتس", "#4ade80", "dems"),
    ("ד", "בל״ד", "التجمع", "#9f1239", "joint"),
    ("ב", "הבית היהודי", "البيت اليهودي", "#7c3aed", ""),
]
letters = [l[0] for l in LISTS]

rows = []
for t in towns:
    v = t["votes"]
    main = [v.get(k, 0) for k in letters]
    rows.append([t["code"], t["name"], t.get("nameEn", ""), names_ar.get(str(t["code"]), ""),
                 t["registered"], t["cast"], t["valid"], *main, t["valid"] - sum(main)])

meta = json.load(open(f"{D}/meta.json"))
nat = meta["nationalTotals"]
out = {
    "source": meta["source"],
    # Includes the soldiers' and other double-envelope votes, which have no town.
    "national": [nat["registered"], nat["cast"], nat["valid"], *[nat["votes"].get(k, 0) for k in letters],
                 nat["valid"] - sum(nat["votes"].get(k, 0) for k in letters)],
    "lists": [{"letter": l, "he": he, "ar": a, "color": c, "now": now.split(",") if now else []} for l, he, a, c, now in LISTS],
    "towns": rows,
}
json.dump(out, open("public/data/towns-2022.json", "w"), ensure_ascii=False, separators=(",", ":"))
print(len(rows), "towns,", os.path.getsize("public/data/towns-2022.json") // 1024, "KB,", sum(1 for r in rows if r[3]), "with Arabic names")

