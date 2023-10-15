const columnSeparator = ',';
const rowSeparator = '\n';

export function csvString(items: any[]) {
  const columns = items[0] ? Object.keys(items[0]) : [];
  return (
    columns.join(columnSeparator) +
    rowSeparator +
    items
      .map((item) =>
        columns
          .map((column) => formatValue(item[column]))
          .join(columnSeparator),
      )
      .join(rowSeparator)
  );
}

export function formatValue(val: any) {
  if (val instanceof Date) return val.toISOString();
  if (typeof val == 'string') return `'${val}'`;
  return val;
}
