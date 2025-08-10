interface Entry<T> {
  value: T;
  expiry: number;
}
const store = new Map<string, Entry<any>>();

export function get<T>(key: string): T | undefined {
  const e = store.get(key);
  if (!e) return undefined;
  if (Date.now() > e.expiry) {
    store.delete(key);
    return undefined;
  }
  return e.value as T;
}

export function set<T>(key: string, value: T, ttlSec: number) {
  store.set(key, { value, expiry: Date.now() + ttlSec * 1000 });
}
