// Party data for the 26th Knesset election (27 Oct 2026).
//
// Everything here is a first draft to be checked before launch:
// - `poll`: Kantar for Kan 11, 6 Sep 2026 (via Wikipedia's polling table).
// - `candidates`: partial lists from Wikipedia "Party lists for the 2026
//   Israeli legislative election"; Hebrew spellings not yet checked against
//   the Central Elections Committee (CEC) lists.
// - `spectrum` and `positions`: editorial summaries, not party platforms.
//   Each should get a source link before it is marked verified.

export type Bloc = "coalition" | "opposition" | "arab";

export type CategoryId = "security" | "religion" | "economy" | "judiciary" | "draft";

export const categories: { id: CategoryId; label: string }[] = [
  { id: "security", label: "ביטחון ומדיני" },
  { id: "religion", label: "דת ומדינה" },
  { id: "economy", label: "כלכלה ויוקר המחיה" },
  { id: "judiciary", label: "מערכת המשפט" },
  { id: "draft", label: "גיוס חרדים" },
];

export type Candidate = { pos: number; name: string; note?: string };

export type Party = {
  id: string;
  name: string;
  nameEn: string;
  leader: string;
  color: string;
  bloc: Bloc;
  poll: number;
  seats25?: number;
  // 0 = left, 1 = right (security / diplomatic axis)
  // 0 = secular, 1 = religious (religion and state axis)
  spectrum: { right: number; religious: number };
  summary: string;
  positions: Partial<Record<CategoryId, string>>;
  candidates: Candidate[];
};

export const KNESSET_SEATS = 120;
export const MAJORITY = 61;
export const THRESHOLD = 0.0325;
export const POLL_SOURCE = "קנטאר עבור כאן 11, 6 בספטמבר 2026";

export const blocLabels: Record<Bloc, string> = {
  coalition: "גוש הקואליציה",
  opposition: "גוש האופוזיציה",
  arab: "המפלגות הערביות",
};

export const parties: Party[] = [
  {
    id: "yashar",
    name: "ישר",
    nameEn: "Yashar",
    leader: "גדי איזנקוט",
    color: "#0ea5e9",
    bloc: "opposition",
    poll: 23,
    spectrum: { right: 0.45, religious: 0.3 },
    summary: "מפלגת מרכז חדשה בראשות הרמטכ״ל לשעבר גדי איזנקוט.",
    positions: {
      security: "דגש על ביטחון ממלכתי והחזרת האמון במערכת הביטחון.",
    },
    candidates: [
      { pos: 1, name: "גדי איזנקוט", note: "יו״ר, רמטכ״ל לשעבר" },
      { pos: 6, name: "חילי טרופר" },
    ],
  },
  {
    id: "likud",
    name: "הליכוד",
    nameEn: "Likud",
    leader: "בנימין נתניהו",
    color: "#1d4ed8",
    bloc: "coalition",
    poll: 20,
    seats25: 32,
    spectrum: { right: 0.75, religious: 0.45 },
    summary: "מפלגת הימין הגדולה, בראשות ראש הממשלה בנימין נתניהו.",
    positions: {
      security: "עמדה ניצית, התנגדות למדינה פלסטינית, דגש על הרתעה.",
      economy: "כלכלת שוק חופשי והפחתת מסים.",
      judiciary: "תומכת בשינויים במערכת המשפט ובמינוי שופטים.",
    },
    candidates: [
      { pos: 1, name: "בנימין נתניהו", note: "יו״ר המפלגה" },
      { pos: 2, name: "אלי כהן" },
      { pos: 4, name: "ישראל כ״ץ" },
      { pos: 5, name: "גדעון סער" },
      { pos: 6, name: "אמיר אוחנה" },
      { pos: 7, name: "יריב לוין" },
      { pos: 8, name: "מירי רגב" },
    ],
  },
  {
    id: "together",
    name: "ביחד",
    nameEn: "Together",
    leader: "נפתלי בנט",
    color: "#14b8a6",
    bloc: "opposition",
    poll: 13,
    seats25: 24,
    spectrum: { right: 0.55, religious: 0.3 },
    summary: "רשימה משותפת של נפתלי בנט ויש עתיד של יאיר לפיד.",
    positions: {
      draft: "תומכת בגיוס חרדים ובשוויון בנטל.",
    },
    candidates: [
      { pos: 1, name: "נפתלי בנט", note: "יו״ר הרשימה" },
      { pos: 2, name: "יאיר לפיד", note: "יו״ר יש עתיד" },
      { pos: 3, name: "קרן טרנר אייל" },
      { pos: 4, name: "מירב בן ארי" },
      { pos: 5, name: "לירן אביסר בן חורין" },
      { pos: 6, name: "נעם תיבון" },
      { pos: 7, name: "מיכל נגרי" },
      { pos: 8, name: "איתן גינזבורג" },
    ],
  },
  {
    id: "dems",
    name: "הדמוקרטים",
    nameEn: "The Democrats",
    leader: "יאיר גולן",
    color: "#dc2626",
    bloc: "opposition",
    poll: 8,
    seats25: 4,
    spectrum: { right: 0.1, religious: 0.05 },
    summary: "איחוד העבודה ומרצ, שמאל ציוני.",
    positions: {
      security: "תומכת בהסדר מדיני עם הפלסטינים.",
      religion: "תומכת בהפרדת דת ממדינה ובנישואים אזרחיים.",
      judiciary: "מתנגדת לשינויים במערכת המשפט.",
      draft: "תומכת בגיוס חרדים.",
    },
    candidates: [
      { pos: 1, name: "יאיר גולן", note: "יו״ר המפלגה" },
      { pos: 2, name: "נעמה לזימי" },
      { pos: 3, name: "גלעד קריב" },
      { pos: 4, name: "אפרת רייטן" },
      { pos: 5, name: "יאיא פינק" },
      { pos: 6, name: "גבי לסקי" },
      { pos: 7, name: "עמרי רונן" },
      { pos: 8, name: "מיכל רוזין" },
    ],
  },
  {
    id: "utj",
    name: "יהדות התורה",
    nameEn: "United Torah Judaism",
    leader: "יעקב אשר",
    color: "#404040",
    bloc: "coalition",
    poll: 8,
    seats25: 7,
    spectrum: { right: 0.65, religious: 1 },
    summary: "מפלגה חרדית אשכנזית.",
    positions: {
      religion: "שמירה על הסטטוס קוו הדתי ומעמד היהדות במרחב הציבורי.",
      draft: "מתנגדת לגיוס תלמידי ישיבות לצבא.",
    },
    candidates: [{ pos: 1, name: "יעקב אשר", note: "עומד בראש הרשימה" }],
  },
  {
    id: "otzma",
    name: "עוצמה יהודית",
    nameEn: "Otzma Yehudit",
    leader: "איתמר בן גביר",
    color: "#f59e0b",
    bloc: "coalition",
    poll: 7,
    seats25: 6,
    spectrum: { right: 0.98, religious: 0.7 },
    summary: "מפלגת ימין קיצוני בראשות איתמר בן גביר.",
    positions: {
      security: "עמדה ניצית מאוד, תמיכה בריבונות ובהתיישבות.",
    },
    candidates: [
      { pos: 1, name: "איתמר בן גביר", note: "יו״ר המפלגה" },
      { pos: 5, name: "לימור סון הר-מלך" },
      { pos: 6, name: "יצחק קרויזר" },
    ],
  },
  {
    id: "shas",
    name: "ש״ס",
    nameEn: "Shas",
    leader: "אריה דרעי",
    color: "#171717",
    bloc: "coalition",
    poll: 7,
    seats25: 11,
    spectrum: { right: 0.7, religious: 0.9 },
    summary: "מפלגה חרדית ספרדית בראשות אריה דרעי.",
    positions: {
      religion: "שמירה על הסטטוס קוו הדתי.",
      economy: "דגש על רווחה וקצבאות לשכבות חלשות.",
      draft: "מתנגדת לגיוס תלמידי ישיבות לצבא.",
    },
    candidates: [{ pos: 1, name: "אריה דרעי", note: "יו״ר המפלגה" }],
  },
  {
    id: "yb",
    name: "ישראל ביתנו",
    nameEn: "Yisrael Beiteinu",
    leader: "אביגדור ליברמן",
    color: "#16a34a",
    bloc: "opposition",
    poll: 7,
    seats25: 6,
    spectrum: { right: 0.7, religious: 0.05 },
    summary: "מפלגת ימין חילונית בראשות אביגדור ליברמן.",
    positions: {
      security: "עמדה ניצית בנושאי ביטחון.",
      religion: "תומכת בנישואים אזרחיים ובתחבורה ציבורית בשבת.",
      draft: "תומכת בגיוס חרדים.",
    },
    candidates: [
      { pos: 1, name: "אביגדור ליברמן", note: "יו״ר המפלגה" },
      { pos: 2, name: "רפי בן שטרית" },
      { pos: 3, name: "טליה לנקרי" },
      { pos: 4, name: "עודד פורר" },
      { pos: 5, name: "יוליה מלינובסקי" },
      { pos: 6, name: "שרון שרעבי" },
      { pos: 7, name: "חמד עמאר" },
      { pos: 8, name: "יבגני סובה" },
    ],
  },
  {
    id: "joint",
    name: "הרשימה המשותפת",
    nameEn: "Joint List",
    leader: "יוסף ג׳בארין",
    color: "#9f1239",
    bloc: "arab",
    poll: 7,
    seats25: 5,
    spectrum: { right: 0.05, religious: 0.2 },
    summary: "איחוד של חד״ש, תע״ל ובל״ד.",
    positions: {
      security: "תומכת בסיום הכיבוש ובמדינה פלסטינית.",
    },
    candidates: [
      { pos: 1, name: "יוסף ג׳בארין", note: "יו״ר חד״ש" },
      { pos: 2, name: "אחמד טיבי", note: "יו״ר תע״ל" },
      { pos: 3, name: "סאמי אבו שחאדה", note: "יו״ר בל״ד" },
      { pos: 6, name: "עופר כסיף" },
    ],
  },
  {
    id: "rzp",
    name: "הציונות הדתית–זהות",
    nameEn: "RZP–Zehut",
    leader: "בצלאל סמוטריץ׳",
    color: "#b45309",
    bloc: "coalition",
    poll: 6,
    seats25: 7,
    spectrum: { right: 0.95, religious: 0.8 },
    summary: "איחוד הציונות הדתית של סמוטריץ׳ וזהות של משה פייגלין.",
    positions: {
      security: "תמיכה בהתיישבות ובהחלת ריבונות.",
      judiciary: "תומכת בשינויים מקיפים במערכת המשפט.",
    },
    candidates: [
      { pos: 1, name: "בצלאל סמוטריץ׳", note: "יו״ר המפלגה" },
      { pos: 2, name: "משה פייגלין", note: "יו״ר זהות" },
      { pos: 3, name: "אורית סטרוק" },
      { pos: 4, name: "צביקה מור" },
      { pos: 5, name: "שמחה רוטמן" },
      { pos: 6, name: "צבי סוכות" },
      { pos: 7, name: "אוהד טל" },
    ],
  },
  {
    id: "raam",
    name: "רע״מ",
    nameEn: "Ra'am",
    leader: "מנסור עבאס",
    color: "#15803d",
    bloc: "arab",
    poll: 6,
    seats25: 5,
    spectrum: { right: 0.2, religious: 0.7 },
    summary: "מפלגה ערבית אסלאמית שמרנית, בראשות מנסור עבאס.",
    positions: {
      economy: "דגש על תקציבים ופיתוח לחברה הערבית ומאבק בפשיעה.",
    },
    candidates: [
      { pos: 1, name: "מנסור עבאס", note: "יו״ר המפלגה" },
      { pos: 2, name: "יואב סגלוביץ׳" },
    ],
  },
  {
    id: "reservists",
    name: "המילואימניקים–הכלכלית החדשה",
    nameEn: "Reservists–New Economic Party",
    leader: "טרם הוזן",
    color: "#64748b",
    bloc: "opposition",
    poll: 4,
    spectrum: { right: 0.65, religious: 0.3 },
    summary: "טרם הוזן מידע על המפלגה.",
    positions: {},
    candidates: [],
  },
  {
    id: "amcha",
    name: "עמך ישראל",
    nameEn: "Amcha Yisrael",
    leader: "עופר וינטר",
    color: "#7c3aed",
    bloc: "opposition",
    poll: 4,
    spectrum: { right: 0.85, religious: 0.55 },
    summary: "מפלגה חדשה בראשות האלוף (במיל׳) עופר וינטר.",
    positions: {},
    candidates: [
      { pos: 1, name: "עופר וינטר", note: "יו״ר המפלגה" },
      { pos: 2, name: "יוסף חדאד" },
      { pos: 3, name: "פלר חסן-נחום" },
      { pos: 4, name: "נטלי שם טוב" },
    ],
  },
  {
    id: "bw",
    name: "כחול לבן",
    nameEn: "Blue and White",
    leader: "בני גנץ",
    color: "#60a5fa",
    bloc: "opposition",
    poll: 0,
    seats25: 8,
    spectrum: { right: 0.45, religious: 0.3 },
    summary: "מפלגת מרכז בראשות בני גנץ. בסקר זה מתחת לאחוז החסימה.",
    positions: {},
    candidates: [{ pos: 1, name: "בני גנץ", note: "יו״ר המפלגה" }],
  },
];
