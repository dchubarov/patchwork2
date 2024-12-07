export const nullishToUndefined = <T>(value: T): NonNullable<T> | undefined =>
  value ?? undefined;
