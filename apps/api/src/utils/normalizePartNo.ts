/**
 * Normalizes a part number by removing all whitespace, dashes, slashes, and dots,
 * and converting to uppercase.
 * Example: '12345-ABC-000' -> '12345ABC000'
 */
export function normalizePartNo(partNo: string): string {
  if (!partNo) return '';
  return partNo.replace(/[\s\-_.\/\\]+/g, '').toUpperCase();
}

/**
 * Checks if two part numbers match after normalization.
 */
export function matchesPartNo(a: string, b: string): boolean {
  return normalizePartNo(a) === normalizePartNo(b);
}
