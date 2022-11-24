export function ensureArray<T = string>(value: T | T[]): T[] {
  if (Array.isArray(value)) {
    return value
  } else {
    return [value]
  }
}
