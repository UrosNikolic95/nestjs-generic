import { ICsvData } from './crud.interface';
import { Response } from 'express';

function getColumns(items: any[]) {
  const columns = new Set<string>();
  items.forEach((item) => {
    Object.keys(item).forEach((column) => columns.add(column));
  });
  return Array.from(columns);
}

export function csvRes(res: Response, items: any[], data?: ICsvData) {
  const fileName = data?.fileName || 'data.csv';
  const filenameWithExtention = fileName.endsWith('.csv')
    ? fileName
    : fileName + '.csv';
  const csvStr = csvString(items, data);
  res.header('Content-Type', 'text/csv');
  res.attachment(filenameWithExtention);
  res.send(csvStr);
}

export function csvString(items: any[], data?: ICsvData) {
  const columnSeparator = data?.columnSeparator || ',';
  const rowSeparator = data?.rowSeparator || '\n';
  const columns = data?.columnsFromAllItems
    ? getColumns(items)
    : items.length
    ? Object.keys(items[0])
    : [];
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
