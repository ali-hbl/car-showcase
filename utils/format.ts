// utils/format.ts
const PREMIUM = 'premium subscribers only';

export function toNumOrNull(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function safeText(v: unknown, fallback = 'N/A'): string {
  if (v == null) return fallback;
  const s = String(v).trim();
  if (!s || s.includes(PREMIUM)) return fallback;
  return s;
}
