// Two ways to put election day in a calendar: Google, or an .ics file that
// Apple, Outlook and most phones open.
const GOOGLE =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  `&text=${encodeURIComponent("בחירות לכנסת - הולכים להצביע")}` +
  "&dates=20261027T040000Z/20261027T190000Z" +
  `&details=${encodeURIComponent("הקלפיות פתוחות 07:00-22:00. להביא תעודה מזהה עם תמונה. בודקים את הקלפי באתר ועדת הבחירות: https://www.bechirot.gov.il/")}`;

// Hebrew by default; the translated sections pass their own labels.
export default function CalendarButtons({ labels }: { labels?: { google: string; other: string } }) {
  const btn = "rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-800";
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <a href={GOOGLE} target="_blank" rel="noreferrer" className={btn}>
        📅 {labels?.google ?? "להוסיף ליומן גוגל"}
      </a>
      <a href="/election-day.ics" className={btn}>
        📅 {labels?.other ?? "להוסיף ליומן אחר (אפל / אאוטלוק)"}
      </a>
    </div>
  );
}
