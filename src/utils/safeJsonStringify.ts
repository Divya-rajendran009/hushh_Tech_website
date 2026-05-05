export function safeJsonStringify(value: unknown, fallback = ""): string {
  try {
    return JSON.stringify(value);
  } catch {
    return fallback;
  }
}