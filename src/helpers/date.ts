export const formatRange = (start: string, end: string | null, locale: string, present: string) => {
  const formatMonth = (value: string) => new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}-01T00:00:00Z`));
  return `${formatMonth(start)} – ${end ? formatMonth(end) : present}`;
};
