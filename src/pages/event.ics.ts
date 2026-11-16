/**
 * Calendar file for the home page's featured event (`site.event`), built
 * statically to /event.ics. The "Add to calendar" button links here: iOS and
 * macOS open it straight in Calendar; Outlook and Google import it.
 *
 * With `opens` set, the entry is the opening night: that time to three hours
 * later (no closing time on record), noting the show runs to the last day.
 * Without it, an all-day range: DTEND is the day after the last day, as
 * iCalendar's DATE ranges are end-exclusive. Times go out in UTC (SAST is a
 * fixed UTC+2, no DST), so no VTIMEZONE block is needed.
 */
import type { APIRoute } from 'astro';
import { site } from '@/lib/site';

const ymd = (iso: string) => iso.replaceAll('-', '');
const dayAfter = (iso: string) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
};
// local SAST date + time → iCalendar UTC stamp
const utc = (iso: string, hhmm: string, addHours = 0) => {
  const d = new Date(`${iso}T${hhmm}:00+02:00`);
  d.setUTCHours(d.getUTCHours() + addHours);
  return d.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
};
const longDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
// RFC 5545 text escaping
const esc = (s: string) => s.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');

export const GET: APIRoute = () => {
  const e = site.event;
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wawa Surfboards//Event//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
  if (e) {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${e.start}-event@${new URL(site.url).host}`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
      ...(e.opens
        ? [`DTSTART:${utc(e.start, e.opens)}`, `DTEND:${utc(e.start, e.opens, 3)}`]
        : [`DTSTART;VALUE=DATE:${ymd(e.start)}`, `DTEND;VALUE=DATE:${ymd(dayAfter(e.end))}`]),
      `SUMMARY:${esc(`${e.title} · ${e.artist}`)}`,
      `DESCRIPTION:${esc(`${e.blurb}${e.opens ? ` Opening night; on until ${longDate(e.end)}.` : ''}\n${site.url}`)}`,
      `LOCATION:${esc(`${e.venue}, ${e.street}, ${e.locality}`)}`,
      `URL:${site.url}/`,
      'END:VEVENT',
    );
  }
  lines.push('END:VCALENDAR');
  return new Response(lines.join('\r\n') + '\r\n', {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  });
};
