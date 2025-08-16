const PREMIUM = 'premium subscribers only';

export function isPremiumOnly(v: unknown) {
  return typeof v === 'string' && v.toLowerCase().includes(PREMIUM);
}

export function safeText(v: unknown, fallback = 'N/A'): string {
  if (v == null) return fallback;
  const s = String(v).trim();
  if (!s || isPremiumOnly(s)) return fallback;
  return s;
}

export function toNumOrNull(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}
