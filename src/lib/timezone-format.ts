const options: Intl.DateTimeFormatOptions = {
  timeZone: "Europe/Bucharest",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
};

/**
 * Formats a given UTC date to the Romanian timezone and locale.
 *
 * @param utcDate - The UTC date to be formatted.
 * @returns The formatted date string in the "ro-RO" locale.
 */
export function formatDateToRomaniaTimezone(utcDate: Date): string {
  return new Intl.DateTimeFormat("ro-RO", options).format(utcDate);
}
