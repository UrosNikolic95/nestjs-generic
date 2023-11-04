import { Type, UnprocessableEntityException } from '@nestjs/common';
import { ICsvData } from './crud.interface';
import { Response } from 'express';
import * as XLSX from 'xlsx';
import { plainToInstance } from 'class-transformer';
import { ValidationError, validateSync } from 'class-validator';
import { EntityTarget } from 'typeorm';

function getColumns(items: any[]) {
  const columns = new Set<string>();
  items.forEach((item) => {
    Object.keys(item).forEach((column) => columns.add(column));
  });
  return Array.from(columns);
}

function findError(data: any[]) {
  for (const item of data) {
    const errors = validateSync(item, { whitelist: true });
    if (errors.length) return errors;
  }
  return [];
}

export function fromBufferToJson(
  file: Express.Multer.File,
  entityType: any,
): any[] {
  const data = XLSX.read(file.buffer, { type: 'buffer' });
  const json = data.SheetNames.flatMap((name) =>
    XLSX.utils.sheet_to_json(data.Sheets[name]),
  );
  const instances = json.map((el) => plainToInstance(entityType, el));
  const errors = findError(instances);
  if (errors.length) {
    throw new UnprocessableEntityException(
      errors.flatMap((error) => Object.values(error.constraints)),
    );
  }
  return instances;
}

export function csvResXlsx(res: Response, items: any[], data?: ICsvData) {
  const fileName = data?.fileName || 'data.csv';
  const filenameWithExtention = fileName.endsWith('.csv')
    ? fileName
    : fileName + '.csv';
  const sheet = XLSX.utils.json_to_sheet(items);
  const csv = XLSX.utils.sheet_to_csv(sheet);
  res.header('Content-Type', 'text/csv');
  res.attachment(filenameWithExtention);
  res.send(csv);
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
          .map((column) => formatValueCsv(item[column]))
          .join(columnSeparator),
      )
      .join(rowSeparator)
  );
}

export function formatValueCsv(val: any) {
  if (val instanceof Date) return val.toISOString();
  if (typeof val == 'string') return `'${val}'`;
  return val;
}
