export function formatValue(val: any) {
  if (typeof val == 'string') return `'${val}'`;
  if (val instanceof Date) return `'${val.toISOString()}'`;
  return val;
}
