// A calendar reminder for election day: polls open 07:00-22:00 Israel time.
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//election-map//he",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    "UID:election-day-2026@election-map",
    "DTSTAMP:20261020T000000Z",
    "DTSTART:20261027T040000Z",
    "DTEND:20261027T190000Z",
    "SUMMARY:בחירות לכנסת - הולכים להצביע",
    `DESCRIPTION:הקלפיות פתוחות 07:00-22:00. להביא תעודה מזהה עם תמונה. את הקלפי שלכם בודקים באתר ועדת הבחירות: https://www.bechirot.gov.il/\\nהמפלגות והעמדות: ${SITE_URL}`,
    `URL:${SITE_URL}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT1H",
    "ACTION:DISPLAY",
    "DESCRIPTION:היום בחירות. הקלפיות פתוחות עד 22:00",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return new Response(ics, {
    headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": 'attachment; filename="election-day.ics"' },
  });
}
