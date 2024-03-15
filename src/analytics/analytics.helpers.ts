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

interface IFromDateParam {
  date?: Date;
  years?: number;
  months?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}

export function dateFrom({
  date,
  years,
  months,
  days,
  hours,
  minutes,
  seconds,
  milliseconds,
}: IFromDateParam) {
  // new Date(undefined) throws error
  const clone = date ? new Date(date) : new Date();
  if (years) clone.setFullYear(clone.getFullYear() + years);
  if (months) clone.setMonth(clone.getMonth() + months);
  if (days) clone.setDate(clone.getDate() + days);
  if (hours) clone.setHours(clone.getHours() + hours);
  if (minutes) clone.setMinutes(clone.getMinutes() + minutes);
  if (seconds) clone.setSeconds(clone.getSeconds() + seconds);
  if (milliseconds)
    clone.setMilliseconds(clone.getMilliseconds() + milliseconds);
  return clone;
}
