type HasName = { name: string };

export function extractNamesFromDataType<T extends HasName>(input?: T[] | null): string[] {
  return Array.isArray(input) ? input.map(item => item.name) : [];
}
