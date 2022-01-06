export function deleteFirst<T>(arr: T[], val: T): T[] {
  const idx = arr.findIndex(v => v === val);
  arr.splice(idx, 1);
  return [...arr];
}
