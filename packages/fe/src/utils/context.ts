import { Context, useContext } from 'react';

export function useSafeContext<T>(
  context: Context<T>,
  msg?: string | (() => string)
): NonNullable<T> {
  const result = useContext(context);
  if (!result) {
    throw new Error(
      (typeof msg === 'function' ? msg() : msg) ??
        `Nullish value returned for ${context.displayName ?? typeof context}`
    );
  }
  return result;
}
