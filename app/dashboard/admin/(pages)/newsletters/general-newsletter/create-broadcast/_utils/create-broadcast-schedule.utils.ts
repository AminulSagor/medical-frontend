export const BROADCAST_TIMEZONE = "America/Chicago";

function getTimeZoneOffset(date: Date, timeZone: string): number {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(date);
  const map = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  const asUtc = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour),
    Number(map.minute),
    Number(map.second),
  );

  return asUtc - date.getTime();
}

export function zonedDateAndTimeToUtcIso(
  dateValue: string,
  timeValue: string,
  timeZone: string,
): string {
  const [year, month, day] = dateValue.split("-").map(Number);
  const [hour, minute] = timeValue.split(":").map(Number);

  const naiveUtcGuess = Date.UTC(year, month - 1, day, hour, minute, 0);
  const initialOffset = getTimeZoneOffset(new Date(naiveUtcGuess), timeZone);
  let result = naiveUtcGuess - initialOffset;

  const adjustedOffset = getTimeZoneOffset(new Date(result), timeZone);
  if (adjustedOffset !== initialOffset) {
    result = naiveUtcGuess - adjustedOffset;
  }

  return new Date(result).toISOString();
}