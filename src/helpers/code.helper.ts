export function generateCode(digits: number) {
  return Math.floor(Math.random() * Math.pow(10, digits))
    .toString()
    .padStart(digits, '0');
}
