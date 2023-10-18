export function formatValue(val: any) {
  if (typeof val == 'string') return `'${val}'`;
  if (val instanceof Date) return `'${val.toISOString()}'`;
  return val;
}

export function formatValueArray(values: any[]) {
  const columns = Object.keys(values[0]);

  return values
    .map(
      (row) =>
        `(${columns.map((column) => formatValue(row[column])).join(',')})`,
    )
    .join(',');
}

export function dateFrom({
  date = new Date(),
  years,
  months,
  days,
  hours,
  minutes,
  seconds,
  milliseconds,
}: {
  date?: Date;
  years?: number;
  months?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}) {
  if (years) date.setFullYear(date.getFullYear() + years);
  if (months) date.setMonth(date.getMonth() + months);
  if (days) date.setDate(date.getDate() + days);
  if (hours) date.setHours(date.getHours() + hours);
  if (minutes) date.setMinutes(date.getMinutes() + minutes);
  if (seconds) date.setSeconds(date.getSeconds() + seconds);
  if (milliseconds) date.setMilliseconds(date.getMilliseconds() + milliseconds);
  return date;
}
