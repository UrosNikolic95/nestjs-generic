export function formatValue(val: any) {
  if (typeof val == 'string') return `'${val}'`;
  if (val instanceof Date) return `'${val.toISOString()}'`;
  return val;
}

export function formatValueArray(values: any[], concat?: string[]) {
  const columns = Object.keys(values[0]);

  return values
    .map(
      (row) =>
        `(${columns
          .map((column) => formatValue(row[column]))
          .concat(concat)
          .join(',')})`,
    )
    .join(',');
}
