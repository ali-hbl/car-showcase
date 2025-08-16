import { CarProps, FilterProps } from '@/types';
import { toNumOrNull } from './format';

const key = process.env.RAPID_API_KEY;
const API_HOST = 'cars-by-api-ninjas.p.rapidapi.com';

export async function fetchCars(filters: FilterProps) {
  const manufacturer = (filters.manufacturer ?? '').trim();
  const model = (filters.model ?? '').trim();
  const fuel = (filters.fuel ?? '').trim();
  const limitNum = Number(filters.limit ?? 10);
  const year = filters.year !== undefined || filters.year !== '' ? String(filters.year) : '';

  const key = process.env.RAPID_API_KEY;
  if (!key) return [];

  const qs = new URLSearchParams();
  if (manufacturer) qs.set('make', manufacturer);
  if (model) qs.set('model', model);
  if (fuel) qs.set('fuel_type', fuel);
  if (year) qs.set('year', year);

  // ⛔️ NE PAS ENVOYER `limit` → premium only
  const url = `https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?${qs.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        'X-RapidAPI-Key': key,
        'X-RapidAPI-Host': 'cars-by-api-ninjas.p.rapidapi.com',
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      // Optionnel: log du corps pour debug fin
      console.error('Cars API error:', response.status, await response.text());
      return [];
    }

    const data = await response.json();
    // Coupe côté serveur pour l’UI
    return Array.isArray(data) ? data.slice(0, Math.max(1, limitNum)) : [];
  } catch {
    return [];
  }
}

async function callCarsAPI(qs: URLSearchParams) {
  if (!key) return [];
  const url = `https://${API_HOST}/v1/cars?${qs.toString()}`;
  const res = await fetch(url, {
    headers: {
      'X-RapidAPI-Key': key,
      'X-RapidAPI-Host': API_HOST,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchDefaultCars(take = 24) {
  const popularMakes = ['toyota', 'honda', 'ford', 'bmw', 'mercedes', 'audi', 'volkswagen', 'hyundai', 'kia', 'nissan'];

  const results = await Promise.allSettled(popularMakes.map((m) => callCarsAPI(new URLSearchParams([['make', m]]))));

  // flat + dedupe (make+model+year)
  const all = results.filter((r) => r.status === 'fulfilled').flatMap((r: any) => r.value as any[]);

  const seen = new Set<string>();
  const deduped: any[] = [];
  for (const c of all) {
    const key = `${c.make ?? ''}|${c.model ?? ''}|${c.year ?? ''}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(c);
    if (deduped.length >= take) break;
  }
  return deduped;
}

export function calculateCarRent(cityMpg: any, year: any) {
  const mpg = toNumOrNull(cityMpg) ?? 25; // valeur par défaut raisonnable
  const yr = toNumOrNull(year) ?? 2019;

  const basePricePerDay = 40; // à ta guise
  const ageFactor = Math.max(0, new Date().getFullYear() - yr) * 0.1;
  const mpgFactor = 1 + Math.max(0, 30 - Math.min(30, mpg)) * 0.02;

  return Math.round(basePricePerDay * (1 + ageFactor) * mpgFactor);
}

// utils/index.ts (ou où est ta fonction)
export const generateCarImageUrl = (car: Partial<CarProps>, angle?: string): string => {
  const url = new URL('https://cdn.imagin.studio/getimage');

  const make = (car.make ?? '').toString().trim();
  const model = (car.model ?? '').toString().trim();
  const year = typeof car.year === 'number' ? String(car.year) : (car.year ?? '').toString().trim();

  // Si make ou model manquent, renvoyer une image de fallback
  if (!make || !model) return '/public/hero.png';

  url.searchParams.append('customer', 'hrjavascript-mastery');
  url.searchParams.append('make', make);
  url.searchParams.append('modelFamily', model.split(' ')[0]);
  url.searchParams.append('zoomType', 'fullscreen');

  if (year) url.searchParams.append('modelYear', year);
  if (angle) url.searchParams.append('angle', `${angle}`);

  return url.toString();
};

export const updateSearchParams = (type: string, value: string) => {
  const searchParams = new URLSearchParams(window.location.search); // Get the current URL search params
  searchParams.set(type, value); // Set the specified search parameter to the given value

  const newPathname = `${window.location.pathname}?${searchParams.toString()}`; // Set the specified search parameter to the given value

  return newPathname;
};
