/** Integer rating helpers shared by the component and its tests. */
export function normalizeMax(value) {
  const number = Number(value);
  return Number.isInteger(number) && number >= 1 && number <= 100 ? number : 5;
}
export function normalizeValue(value, max = 5) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(0, Math.round(number))) : 0;
}
